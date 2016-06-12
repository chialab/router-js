import { Router } from '../src/router.js';
import { pushState, bindRoutes, Iterator } from './util.js';

/* globals describe, before, after, beforeEach, afterEach, it, assert */
describe('Unit: Router', () => {
    const router = new Router({
        base: '/',
    });

    describe('no base configuration', () => {
        const routes = {
            '/posts/*': false,
            '/posts': false,
            '/*': false,
        };

        before((done) => {
            bindRoutes(router, routes);
            let iterator = new Iterator();
            iterator.add(() => pushState(null, '', router.resolve('/posts/11')));
            iterator.add(() => pushState(null, '', router.resolve('/posts')));
            iterator.add(() => pushState(null, '', router.resolve('/action')));
            iterator.exec(done);
        });

        after(() => {
            router.stop();
        });

        it('should trigger the function for the url "/posts/:id"', () => {
            assert(Array.isArray(routes['/posts/*']));
            assert.equal(routes['/posts/*'].length, 1);
            assert.equal(routes['/posts/*'][0], '11');
        });

        it('should trigger the function for the url "/posts"', () => {
            assert(Array.isArray(routes['/posts']));
            assert.equal(routes['/posts'].length, 0);
        });

        it('should trigger the function for the url "/:controller"', () => {
            assert(Array.isArray(routes['/*']));
            assert.equal(routes['/*'].length, 1);
            assert.equal(routes['/*'][0], 'action');
        });
    });
});
