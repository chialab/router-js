import { Router } from '../src/router.js';
import { back, forward, Iterator } from './util.js';

/* globals describe, before, after, beforeEach, afterEach, it, assert */
describe('Unit: Router', () => {
    const router = new Router();

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
