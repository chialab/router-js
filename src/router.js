import merge from '@chialab/proteins/src/merge.js';
import History from './history.js';
import RouterNotStartedException from './exceptions/not-started-exception.js';
import RouterNotFoundException from './exceptions/not-found-exception.js';
import RouterInvalidException from './exceptions/invalid-exception.js';
import RouterUnhandledException from './exceptions/unhandled-exception.js';
import ParserUndefinedException from './exceptions/parser-undefined-exception.js';
import OutOfHistoryException from './exceptions/out-of-history-exception.js';
import { HISTORY, LOCATION, DOCUMENT } from './browser.js';
import EXPRESS_PARSER from './parsers/express-parser.js';

/**
 * Make a command asynced.
 * @private
 *
 * @param {Object} ctx The context for the method.
 * @param {Function} fn The method to call.
 * @param {umber} delay The delay before debouncing.n
 */
function debounce(ctx, fn, delay = 0) {
    let t;
    return function() {
        clearTimeout(t);
        t = setTimeout(fn.bind(ctx), delay);
    };
}

/**
 * Handle `popstate` event.
 * @private
 *
 * @param {Event} ev
 * @return {void}
 */
function onPopState(ev) {
    let history = this.history;
    if (ev instanceof Event) {
        // browser's event
        let state = HISTORY.state;
        let io = history.indexOfState(state);
        if (io !== -1) {
            let shift = (history.length - history.index - 1) - io;
            history.go(shift);
        } else {
            let path = this.getPathFromBase();
            let newState = history.pushState(null, DOCUMENT && DOCUMENT.title, path);
            HISTORY.replaceState(newState, document.title, this.resolve(path));
        }
    } else {
        // route state
        if (!HISTORY.state || HISTORY.state.timestamp !== history.current.state.timestamp) {
            let path = this.resolve(ev.url);
            if (ev.type === 'push') {
                HISTORY.pushState(ev.state, ev.title, path);
            } else {
                HISTORY.replaceState(ev.state, ev.title, path);
            }
        }
    }
}

/**
 * @typedef {Object} ParseResult
 * @property {Array<string>} arguments A list of parsed arguments.
 * @property {Array<Function>} callbacks A list of callbacks for the matched rule.
 */

/**
 * A simple agnostic Router for Web Apps.
 * @class Router
 */
export default class Router {
    /**
     * Extract the pathname from an URL.
     *
     * @param {string} url The URL to parse.
     * @return {string} The pathname.
     */
    static getPathFromRoot(url) {
        url = url || LOCATION.href;
        return url.replace(/^((https?|s?ftps?):\/+)?(.+?)(?=\/|$)/i, '');
    }

    /**
     * A list of options for a Router instance.
     * @memberof Router
     * @private
     */
    get DEFAULTS() {
        return {
            base: '/',
            dispatch: true,
            bind: !!DOCUMENT,
            parser: EXPRESS_PARSER,
            triggerHashChange: true,
        };
    }

    /**
     * Create a Router instance.
     * @memberof Router
     *
     * @param {Object} options A set of options for the router.
     * @param {string} options.base The base pathname for the router (`'#'`).
     * @param {boolean} options.dispatch Should trigger initial state (`true`).
     * @param {boolean} options.bind Should bind to the global `window.history` object (`true`).
     * @param {Function} options.parser The url parser to use (`express`).
     * @param {boolean} options.triggerHashChange Should trigger a new state if only hash has changed (`true`).
     */
    constructor(options = {}) {
        this.history = new History();
        this.started = false;
        this.reset();
        this.options = merge(this.DEFAULTS, options);
        this.parser = this.options.parser;
        this.base = this.options.base;
    }

    /**
     * Reset all router rules.
     * @memberof Router
     */
    reset() {
        this.callbacks = {};
        this.routes = [];
    }

    /**
     * Parse an URL and get a valid router path.
     * @memberof Router
     *
     * @param {string} url The URL to parse.
     * @return {string} A valid router path.
     */
    getPathFromBase(url) {
        let base = this.base;
        if (base && base[0] === '#') {
            url = url || LOCATION.href || '';
            return url.split(base)[1] || '';
        }
        url = LOCATION ? Router.getPathFromRoot(url) : (url || '');
        return this.normalize(url.replace(base, ''));
    }

    /**
     * Check if path name is different from the current one.
     * @memberof Router
     *
     * @param {string} path Path to check.
     * @return {boolean}
     */
    hasPathnameChanged(path) {
        if (typeof this.current !== 'string') {
            return true;
        }
        let oldPath = this.current.split('#').shift();
        let newPath = path.split('#').shift();
        return (oldPath !== newPath);
    }

    /**
     * Detect the router change type.
     * - 0 no changes
     * - 1 hash changed
     * - 2 path changed
     * @memberof Router
     *
     * @param {string} path The new route.
     * @return {umber}n
     */
    changeType(path) {
        if (path !== this.current) {
            return this.hasPathnameChanged(path) ? 2 : 1;
        }
        return 0;
    }

    /**
     * Parse the current path and return bound callbacks.
     * @memberof Router
     *
     * @param {string} path The path to parse.
     * @return {ParseResult} A list of callbacks.
     */
    parse(path) {
        let routes = this.routes;
        let normalizedPath = this.normalize(path).split('?')[0];
        for (let ruleIter = 0, rulesLen = this.routes.length; ruleIter < rulesLen; ruleIter++) {
            let filter = routes[ruleIter];
            let args = this.parser(normalizedPath, this.normalize(filter));
            if (args !== null) {
                return {
                    arguments: args,
                    callbacks: this.callbacks[filter],
                };
            }
        }
        return null;
    }

    /**
     * Parse the current path and trigger callbacks if a match with rules has been found.
     * @memberof Router
     *
     * @param {boolean} force Should trigger also if path has not been changed.
     * @return {boolean} A rule has been matched.
     */
    trigger(force) {
        let path = this.history && this.history.current && this.history.current.url || '';
        let changeType = this.changeType(path);
        if (force || (changeType > 0 && (this.options.triggerHashChange || changeType === 2))) {
            this.current = path;
            if (typeof this.parser !== 'function') {
                return Promise.reject(new ParserUndefinedException());
            }
            let responsePromise;
            let parsed = this.parse(path);
            if (!parsed) {
                return Promise.reject(new RouterNotFoundException());
            }
            parsed.callbacks.forEach((callback) => {
                if (responsePromise) {
                    responsePromise = responsePromise
                        .catch((ex) => {
                            if (ex && ex instanceof RouterUnhandledException) {
                                return callback.apply(this, parsed.arguments);
                            }
                            return Promise.reject(ex);
                        });
                } else {
                    responsePromise = Promise.resolve()
                        .then(() => callback.apply(this, parsed.arguments));
                }
            });
            return responsePromise || Promise.resolve();
        } else if (changeType === 1 && this.options.bind) {
            this.current = path;
            let hashChangedEvent = new Event('hashchange');
            window.dispatchEvent(hashChangedEvent);
        }
        return Promise.resolve();
    }

    /**
     * Bind a rule.
     * @memberof Router
     *
     * @param {string} filter The route rules.
     * @param {Function} callback The callback for the rule.
     * @return {void}
     */
    on(filter, callback) {
        filter = `/${this.normalize(filter)}`;
        this.routes.push(filter);
        this.callbacks[filter] = this.callbacks[filter] || [];
        this.callbacks[filter].push(callback);
    }

    /**
     * Unbind a rule.
     * @memberof Router
     *
     * @param {string} filter The route rules.
     * @param {Function} [callback] The callback for the rule.
     * @return {void}
     */
    off(filter, callback) {
        filter = `/${this.normalize(filter)}`;
        if (callback) {
            let callbacks = this.callbacks[filter] || [];
            let callbackIO = callbacks.indexOf(callback);
            if (callbackIO !== -1) {
                this.callbacks.splice(callbackIO, 1);
            }
        } else {
            delete this.callbacks[filter];
            let routeIO = this.routes.indexOf(filter);
            if (routeIO !== -1) {
                this.routes.splice(routeIO, 1);
            }
        }
    }

    /**
     * Exec a router change.
     * @memberof Router
     *
     * @param {string} path The new current path.
     * @param {string} title The title for the new current path.
     * @param {boolean} shouldReplace Should replace the current state or add a new one.
     * @param {boolean} force Should force the state trigger.
     * @return {Promise} A promise which resolves if the navigation has matched a router's rule.
     */
    navigate(path, title, shouldReplace = false, force = false) {
        if (this.started) {
            path = this.normalize(path);
            if (shouldReplace) {
                this.history.replaceState(null, title, path);
            } else {
                this.history.pushState(null, title, path);
            }
            return this.trigger(force);
        }
        return Promise.reject(new RouterNotStartedException());
    }

    /**
     * Helper method for state refresh.
     * @memberof Router
     *
     * @param {string} path The new current path.
     * @param {string} title The title for the new current path.
     * @param {boolean} shouldReplace Should replace the current state or add a new one.
     * @param {boolean} force Should force the state trigger.
     * @return {Promise} A promise which resolves if the navigation has matched a router's rule.
     */
    refresh() {
        if (this.started) {
            let currentState = this.history && this.history.current && this.history.current;
            if (currentState) {
                return this.navigate(currentState.url, currentState.title, true, true);
            }
            return Promise.reject(new RouterInvalidException());
        }
        return Promise.reject(new RouterNotStartedException());
    }

    /**
     * Move back in the history.
     * @memberof Router
     *
     * @return {Promise} A promise which resolves if the history has been navigated.
     */
    back() {
        if (this.started) {
            return this.history.back();
        }
        return Promise.reject(new RouterNotStartedException());
    }

    /**
     * Move forward in the history.
     * @memberof Router
     *
     * @return {Promise} A promise which resolves if the history has been navigated.
     */
    forward() {
        if (this.started) {
            return this.history.forward();
        }
        return Promise.reject(new RouterNotStartedException());
    }

    /**
     * Init all history's listeners.
     * If `options.dispatch === true` => trigger the initial state.
     * If `options.bind === true` => bind to the global window.history object.
     * @memberof Router
     *
     * @return {Promise}
     */
    start() {
        if (!this.started) {
            let res = Promise.resolve();
            if (this.options.bind) {
                this.current = this.getPathFromBase();
                this.history.pushState(null, DOCUMENT && DOCUMENT.title, this.current);
            }
            this.started = true;
            if (DOCUMENT) {
                this.debouncedEmit = debounce(this, this.trigger, 1).bind(this);
                this.history.on('popstate', this.debouncedEmit);
                if (this.options.dispatch && this.history.length) {
                    res = this.trigger(true);
                }
                if (this.options.bind) {
                    this.bindWindow();
                }
                this.options.dispatch = true;
            }
            return res;
        }
        return Promise.reject();
    }

    /**
     * Remove all history's listeners.
     * @memberof Router
     *
     * @return {void}
     */
    stop() {
        if (this.started) {
            this.history.reset();
            this.history.off('popstate', this.debouncedEmit);
            this.reset();
            if (DOCUMENT) {
                this.unbindWindow();
            }
            this.started = false;
        }
    }

    /**
     * Normalize an URL path, removing leading and trailing slashes.
     * @memberof Router
     *
     * @param {string} path The path to normalize.
     * @return {string} The normalized path.
     */
    normalize(path) {
        return path.replace(/^\/|\/$/, '');
    }

    /**
     * Create a complete URL for the `window.history.pushState` method.
     * @memberof Router
     *
     * @param {string} path A valid router path.
     * @return {string} The complete path.
     */
    resolve(path) {
        path = path.replace(/^\/*/, '');
        let addSlash = this.base.slice(-1) !== '/';
        return `${this.base}${addSlash ? '/' : ''}${path}`;
    }

    /**
     * Parse URL querystring.
     * @memberof Router
     *
     * @param {string} url The URL to parse.
     * @return {Object} A key => value object with querystring params.
     */
    query(url) {
        let q = {};
        url = url || this.current || this.getPathFromBase();
        url.replace(/[?&](.+?)=([^&]*)/g, (_, k, v) => {
            q[k] = v;
        });
        return q;
    }

    /**
     * Bind to window instance.
     * @memberof Router
     *
     * @return {void}
     */
    bindWindow() {
        let state = this.history.current;
        let path = this.resolve(state.url);
        HISTORY.replaceState(state.state, state.title, path);
        this._onPopState = onPopState.bind(this);
        this.history.on('popstate', this._onPopState);
        this.history.on('replacestate', this._onPopState);
        window.addEventListener('popstate', this._onPopState);
    }

    /**
     * Unbind to window instance.
     * @memberof Router
     *
     * @return {void}
     */
    unbindWindow() {
        if (this._onPopState) {
            this.history.off('popstate', this._onPopState);
            this.history.off('replacestate', this._onPopState);
            window.removeEventListener('popstate', this._onPopState);
            delete this._onPopState;
            delete this._onHashChange;
        }
    }
}

export { RouterNotStartedException };
export { RouterNotFoundException };
export { RouterInvalidException };
export { RouterUnhandledException };
export { ParserUndefinedException };
export { OutOfHistoryException };
