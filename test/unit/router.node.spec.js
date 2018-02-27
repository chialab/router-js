/* eslint-env mocha */
import 'promise-polyfill/dist/polyfill.js';
import Router from '../../src/router.js';
import { bindRoutes, Iterator } from './util.js';
import chai from 'chai';

const assert = chai.assert;

describe('Unit: Router Node', () => {
    const router = new Router({
        bind: false,
    });

    describe('no bind configuration', () => {
        const routes = {
            '/posts/*': false,
            '/posts': false,
            '/*': false,
        };

        before((done) => {
            bindRoutes(router, routes);
            let iterator = new Iterator();
            iterator.add(() => router.navigate('/posts/11'));
            iterator.add(() => router.navigate('/posts'));
            iterator.add(() => router.navigate('/action'));
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
