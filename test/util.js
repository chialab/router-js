/* globals describe, before, beforeEach, afterEach, it, assert */

export function debounce(callback) {
    return new Promise((resolve) => {
        setTimeout(() => {
            callback();
            resolve();
        }, 10);
    });
}

function fireEvent() {
    let ev = new Event('popstate');
    window.dispatchEvent(ev);
}

export function pushState(...args) {
    window.history.pushState(...args);
    fireEvent();
}

export function back() {
    window.history.back();
    fireEvent();
}

export function forward() {
    window.history.forward();
    fireEvent();
}

export function bindRoutes(router, routes) {
    router.stop();
    for (let k in routes) {
        if (routes.hasOwnProperty(k)) {
            router.on(k, (...args) => {
                routes[k] = args;
            });
        }
    }
    router.start();
}

export class Iterator {
    constructor() {
        this.tasks = [];
    }

    add(fn) {
        this.tasks.push(fn);
    }

    exec(done, count = 0) {
        let callback = this.tasks[count];
        if (callback) {
            debounce(callback).then(() => {
                count++;
                debounce(() => {
                    this.exec(done, count);
                });
            });
        } else {
            done();
        }
    }
}
