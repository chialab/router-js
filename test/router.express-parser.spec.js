import { Router } from '../src/router.js';
import { pushState, bindRoutes, Iterator } from './util.js';

/* globals describe, before, after, beforeEach, afterEach, it, assert */
describe('Unit: Router', () => {
    const router = new Router({
        parser: Router.EXPRESS_PARSER,
    });

    describe('default configuration', () => {
        const routes = {
            '/posts/:id': false,
            '/posts': false,
            '/:controller': false,
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
            assert(Array.isArray(routes['/posts/:id']));
            assert.equal(routes['/posts/:id'].length, 1);
            assert.equal(routes['/posts/:id'][0], '11');
        });

        it('should trigger the function for the url "/posts"', () => {
            assert(Array.isArray(routes['/posts']));
            assert.equal(routes['/posts'].length, 0);
        });

        it('should trigger the function for the url "/:controller"', () => {
            assert(Array.isArray(routes['/:controller']));
            assert.equal(routes['/:controller'].length, 1);
            assert.equal(routes['/:controller'][0], 'action');
        });
    });
});
