/* eslint-env mocha */
import Router from '../../src/router.js';
import { Iterator } from './util.js';
import chai from 'chai';

const assert = chai.assert;

if (typeof window !== 'undefined') {
    /** HELPERS */
    const fireEvent = function() {
        let ev;
        if (typeof CustomEvent === 'function') {
            ev = new CustomEvent('popstate', {});
        } else {
            ev = document.createEvent('Event');
            ev.initEvent('popstate', true, true);
        }
        window.dispatchEvent(ev);
    };
    
    const back = function() {
        window.history.back();
        fireEvent();
        return Promise.resolve();
    };
    
    const forward = function() {
        window.history.forward();
        fireEvent();
        return Promise.resolve();
    };

    describe('Unit: Router Browser', function() {
        const router = new Router();
        this.timeout(20 * 1000);

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
    });
}
