'use strict';

const assert = require('assert');

const savethis = require('../');
const noopSave = () => null;

describe('savethis', () => {
    describe('synchronous', () => {
        it('should return original function result', () => {
            const fn = savethis(val => val, '', { save: noopSave });

            for (let i = 0; i < 100; i++) {
                const result = fn(i);

                assert.ok(result === i);
            }
        });

        it('should honor custom save and format methods', () => {
            const saved = {};
            const save = (path, val) => (saved[path] = val);
            const format = val => val + 'formatted';

            const iters = [];

            for (let i = 0; i < 100; i++) {
                const fn = savethis(val => val, i, { save, format });

                iters.push(i);
                const val = iters.join('');

                fn(val);

                assert.equal(saved[i], val + 'formatted');
            }
        });
    });

    describe('asynchronous', () => {
        it('should return original function result', async () => {
            const fn = savethis(val => Promise.resolve(val), '', { save: noopSave });

            for (let i = 0; i < 100; i++) {
                const result = await fn(i);

                assert.ok(result === i);
            }
        });

        it('should honor custom save and format methods', async () => {
            const saved = {};
            const save = (path, val) => Promise.resolve((saved[path] = val));
            const format = val => Promise.resolve(val + 'formatted');

            const iters = [];

            for (let i = 0; i < 100; i++) {
                const fn = savethis(val => Promise.resolve(val), i, { save, format });

                iters.push(i);
                const val = iters.join('');

                await fn(val);

                assert.equal(saved[i], val + 'formatted');
            }
        });
    });
});
