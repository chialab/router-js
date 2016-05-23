import { CallbackManager } from 'chialab/callback-manager/src/callback-manager.js';

/**
 * Generate a descriptor for a history state.
 * @private
 *
 * @param {Object} state Some properties of the current state.
 * @param {String} title The title for the current state.
 * @param {String} url The current path.
 * @param {String} type The type of the state ('push'|'replace').
 * @return {Object} A descriptor for the history state.
 */
function createState(state, title, url, type) {
    state = state || {};
    state.timestamp = Date.now();
    return {
        state,
        title,
        url,
        type,
    };
}

export class History {
    /**
     * States collector.
     * An abstraction of the window.history object.
     * @class History
     */
    constructor() {
        const cb = new CallbackManager();
        cb.attachToPrototype(this);
        this.reset();
    }
    /**
     * Get the current state.
     * @type {Object}
     * @readonly
     */
    get current() {
        return this.entries[this.index];
    }
    /**
     * Get history length.
     * @type {Integer}
     * @readonly
     */
    get length() {
        return this.entries.length;
    }
    /**
     * Reset index and entries.
     */
    reset() {
        this.index = 0;
        this.entries = [];
    }
    /**
     * Move in the history.
     *
     * @param {Integer} shift The shift movement in the history.
     * @return {Object} The new current state.
     */
    go(shift) {
        if (shift !== 0) {
            let index = this.index + shift;
            index = Math.max(index, 0);
            index = Math.min(index, this.entries.length - 1);
            this.index = index;
            this.trigger('popstate', this.current);
        }
        return this.current;
    }
    /**
     * Move back in the history by one entry. Same as `.go(-1)`
     *
     * @return {Object} The new current state.
     */
    back() {
        return this.go(-1);
    }
    /**
     * Move forward in the history by one entry. Same as `.go(1)`
     *
     * @return {Object} The new current state.
     */
    forward() {
        return this.go(1);
    }
    /**
     * Find the index of state in the history.
     *
     * @param {Object} state The state to search.
     * @return {Integer} The position of the searched state in history.
     */
    indexOfState(state) {
        state = state || {};
        let entries = this.entries.slice(0).reverse();
        for (let i = 0, len = entries.length; i < len; i++) {
            if (entries[i].state.timestamp === state.timestamp) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Add a state to the history.
     *
     * @param {Object} stateObj The state properties.
     * @param {String} title The state title.
     * @param {String} url The state path.
     * @return {Object} The new current state.
     */
    pushState(stateObj, title, url) {
        let state = createState(stateObj, title, url, 'push');
        this.entries = this.entries.slice(0, this.index + 1);
        this.entries.push(state);
        this.go(1);
        this.trigger('popstate', state);
        return state;
    }
    /**
     * Replace the current state of the history.
     *
     * @param {Object} stateObj The state properties.
     * @param {String} title The state title.
     * @param {String} url The state path.
     * @return {Object} The new current state.
     */
    replaceState(stateObj, title, url) {
        let state = createState(stateObj, title, url, 'replace');
        this.entries[this.index] = state;
        return state;
    }
}
