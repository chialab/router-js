import { History } from './history.js';
import { RouterNotStartedException } from './exceptions/not-started.js';
import { RouterNotFoundException } from './exceptions/not-found.js';
import { ParserUndefinedException } from './exceptions/parser-undefined.js';
import { riotParser } from './parsers/riot.js';
import { expressParser } from './parsers/express.js';

const IS_BROWSER = typeof window !== 'undefined' &&
    typeof window.addEventListener === 'function';
const HISTORY = IS_BROWSER && window.history;
const LOCATION = IS_BROWSER && (HISTORY && HISTORY.location || window && window.location);
const ORIGIN_REGEX = /^((https?|s?ftps?):\/+)?(.+?)(?=\/|$)/i;

let routerCount = 0;

/**
 * Make a command asynced.
 * @private
 *
 * @param {Object} ctx The context for the method.
 * @param {Function} fn The method to call.
 * @param {Number} delay The delay before debouncing.
 */
function debounce(ctx, fn, delay = 0) {
    let t;
    return function() {
        clearTimeout(t);
        t = setTimeout(fn.bind(ctx), delay);
    };
}

function onPopState(ev) {
    let history = this.history;
    if (ev instanceof Event) {
        // window
        let state = HISTORY.state;
        let io = history.indexOfState(state);
        if (io !== -1) {
            let shift = (history.length - history.index - 1) - io;
            history.go(shift);
        } else {
            let path = this.getPathFromBase();
            let newState = history.pushState(null, document.title, path);
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

function bindWindow() {
    let state = this.history.current;
    let path = this.resolve(state.url);
    HISTORY.replaceState(state.state, state.title, path);
    this._onPopState = onPopState.bind(this);
    this.history.on('popstate', this._onPopState);
    window.addEventListener('popstate', this._onPopState);
}

function unbindWindow() {
    if (this._onPopState) {
        this.history.off('popstate', this._onPopState);
        window.removeEventListener('popstate', this._onPopState);
        delete this._onPopState;
        delete this._onHashChange;
    }
}

export class Router {
    static get EXPRESS_PARSER() {
        return expressParser;
    }
    static get RIOT_PARSER() {
        return riotParser;
    }
    static get defaultParser() {
        return this.EXPRESS_PARSER;
    }
    /**
     * A list of options for a Router instance.
     * @namespace
     * @property {String} base The base pathname for the router (`'#'`).
     * @property {Boolean} dispatch Should trigger initial state (`true`).
     * @property {Boolean} bind Should bind to the global `window.history` object (`true`).
     */
    get DEFAULTS() {
        return {
            base: '#',
            dispatch: true,
            bind: true,
            parser: Router.RIOT_PARSER,
        };
    }
    /**
     * Handle application's or component's states.
     * @class Router
     *
     * @param {Object} options A set of options for the router.
     */
    constructor(options = {}) {
        this.history = new History();
        this.started = false;
        this.reset();
        this.options = {};
        for (let key in this.DEFAULTS) {
            if (options.hasOwnProperty(key)) {
                this.options[key] = options[key];
            } else if (this.DEFAULTS.hasOwnProperty(key)) {
                this.options[key] = this.DEFAULTS[key];
            }
        }
        this.parser = this.options.parser;
        this.base = this.options.base;
        this.id = routerCount;
        routerCount++;
    }
    /**
     * Reset all router rules.
     */
    reset() {
        this.callbacks = {};
        this.routes = [];
    }
    /**
     * Parse an URL and get a valid router path.
     *
     * @param {String} url The URL to parse.
     * @return {String} A valid router path.
     */
    getPathFromBase(url) {
        let base = this.base;
        if (base && base[0] === '#') {
            url = url || LOCATION.href || '';
            return url.split(base)[1] || '';
        }
        url = LOCATION ? Router.getPathFromRoot(url) : (url || '');
        return url.replace(base, '');
    }
    /**
     * Parse the current path and trigger callbacks if a match with rules has been found.
     *
     * @param {Boolean} force Should trigger also if path has not been changed.
     * @return {Boolean} A rule has been matched.
     */
    trigger(force) {
        let path = this.history && this.history.current && this.history.current.url || '';
        if (force || path !== this.current) {
            this.current = path;
            if (typeof this.parser !== 'function') {
                return Promise.reject(new ParserUndefinedException());
            }
            let found = false;
            this.routes.some((filter) => {
                let args = this.parser(
                    this.normalize(path),
                    this.normalize(filter)
                );
                if (args !== null) {
                    let clbs = this.callbacks[filter] || [];
                    clbs.some((callback) => {
                        let res = callback.apply(this, args);
                        if (res === false) {
                            return true;
                        }
                        return false;
                    });
                    found = true;
                    return true;
                }
                return false;
            });
            if (found) {
                return Promise.resolve();
            }
            return Promise.reject(new RouterNotFoundException());
        }
        return Promise.resolve();
    }
    /**
     * Bind a rule.
     *
     * @param {String} filter The route rules.
     * @param {Function} callback The callback for the rule.
     */
    on(filter, callback) {
        filter = this.normalize(filter);
        filter = `/${filter}`;
        this.routes.push(filter);
        this.callbacks[filter] = this.callbacks[filter] || [];
        this.callbacks[filter].push(callback);
    }
    /**
     * Exec a router change.
     *
     * @param {String} path The new current path.
     * @param {String} title The title for the new current path.
     * @param {Boolean} shouldReplace Should replace the current state or add a new one.
     * @return {Promise} A promise which resolves if the navigation has matched a router's rule.
     */
    navigate(path, title, shouldReplace = false) {
        if (this.started) {
            path = this.normalize(path);
            if (shouldReplace) {
                this.history.replaceState(null, title, path);
            } else {
                this.history.pushState(null, title, path);
            }
            return this.trigger();
        }
        return Promise.reject(new RouterNotStartedException());
    }
    /**
     * Move back in the history.
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
     */
    start() {
        if (!this.started) {
            if (this.options.bind) {
                this.current = this.getPathFromBase();
                this.history.pushState(null, document.title, this.current);
            }
            this.started = true;
            if (IS_BROWSER) {
                this.debouncedEmit = debounce(this, this.trigger, 1).bind(this);
                this.history.on('popstate', this.debouncedEmit);
                if (this.options.dispatch) {
                    this.trigger(true);
                }
                this.options.dispatch = true;
                if (this.options.bind) {
                    bindWindow.call(this);
                }
            }
        }
    }
    /**
     * Remove all history's listeners.
     */
    stop() {
        if (this.started) {
            this.history.reset();
            this.history.off('popstate', this.debouncedEmit);
            this.reset();
            unbindWindow.call(this);
            this.started = false;
        }
    }
    /**
     * Normalize an URL path.
     *
     * @param {String} path The path to normalize.
     * @return {String} The normalized path.
     */
    normalize(path) {
        return path.replace(/^\/|\/$/, '');
    }
    /**
     * Create a complete URL for the `window.history.pushState` method.
     *
     * @param {String} path A valid router path.
     * @return {String} The complete path.
     */
    resolve(path) {
        path = path.replace(/^\/*/, '');
        let addSlash = this.base.slice(-1) !== '/';
        return `${this.base}${addSlash ? '/' : ''}${path}`;
    }
    /**
     * Parse URL querystring.
     *
     * @param {String} url The URL to parse.
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
     * Extract the pathname from an URL.
     *
     * @param {String} url The URL to parse.
     * @return {String} The pathname.
     */
    static getPathFromRoot(url) {
        url = url || LOCATION.href;
        return url.replace(ORIGIN_REGEX, '');
    }
}
