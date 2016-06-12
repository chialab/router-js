import { Router } from '../src/router.js';
import { pushState, back, forward, bindRoutes, Iterator } from './util.js';

/* globals describe, before, after, beforeEach, afterEach, it, assert */
describe('Unit: Router', () => {
    const router = new Router();

    describe('default configuration', () => {
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

    describe('navigation', () => {
        before((done) => {
            router.start();
            let iterator = new Iterator();
            iterator.add(() => router.navigate('/posts/11'));
            iterator.add(() => router.navigate('/push/'));
            iterator.add(() => router.navigate('/posts', '', true));
            iterator.add(() => router.navigate('/action'));
            iterator.add(() => router.navigate('/action/12'));
            iterator.add(() => router.navigate('/action/20'));
            iterator.add(() => router.back());
            iterator.add(() => router.back());
            iterator.add(() => router.back());
            iterator.add(() => router.forward());
            iterator.add(() => router.forward());
            iterator.add(() => back());
            iterator.add(() => back());
            iterator.add(() => forward());
            iterator.exec(done);
        });

        after(() => {
            router.stop();
        });

        it('should track states', () => {
            assert.equal(router.history.length, 6);
        });

        it('should track the current state', () => {
            assert.equal(router.history.current.url, 'action');
        });
    });

    describe('query', () => {
        before((done) => {
            router.start();
            let iterator = new Iterator();
            iterator.add(() => router.navigate('/person?name=Alan&age=30'));
            iterator.exec(done);
        });

        after(() => {
            router.stop();
        });

        it('should parse querystring', () => {
            let query = router.query();
            assert.equal(query.name, 'Alan');
            assert.equal(query.age, '30');
        });
    });
});
