/* eslint-env mocha */
import Router from '../../src/router.js';
import { Iterator, bindRoutes } from './util.js';
import chai from 'chai';

const assert = chai.assert;

describe('Unit: Router', () => {
    const router = new Router();

    describe('query', function() {
        this.timeout(10 * 1000);

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

    describe('routes', function() {
        this.timeout(10 * 1000);

        const routes = {
            '/posts/*': false,
            '/posts': false,
            '/*': false,
        };

        before((done) => {
            bindRoutes(router, routes);
            let iterator = new Iterator();
            iterator.add(() => router.navigate(router.resolve('/posts/11')));
            iterator.add(() => router.navigate(router.resolve('/posts')));
            iterator.add(() => router.navigate(router.resolve('/action')));
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
