'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const promiseOrNot = require('@fizzygalacticus/promise-or-not');
const { getLogger } = require('@fizzygalacticus/colored-fancy-log');
const logger = getLogger({ name: 'savethis' });

const writeFile = promisify(fs.writeFile);

const getDefaultSaveFunction = (mainMethodWasPromise, formatterWasPromise) =>
    mainMethodWasPromise || formatterWasPromise ? writeFile : fs.writeFileSync;

const onError = err => logger.error(err.message || err);

module.exports = (
    fn = () => {},
    savePath = path.join(process.cwd(), 'savethis.json'),
    { save = null, format = val => JSON.stringify(val, null, 4) } = {}
) =>
    promiseOrNot(
        fn,
        (result, mainMethodWasPromise) =>
            promiseOrNot(
                format,
                (result, formatterWasPromise) => {
                    let fn;

                    if (save) {
                        if (typeof save === 'function') {
                            fn = save;
                        } else {
                            logger.warn('save method passed is not a function');

                            fn = getDefaultSaveFunction(mainMethodWasPromise, formatterWasPromise);
                        }
                    } else {
                        fn = getDefaultSaveFunction(mainMethodWasPromise, formatterWasPromise);
                    }

                    return fn(savePath, result);
                },
                onError,
                mainMethodWasPromise
            )(result),
        onError
    );
