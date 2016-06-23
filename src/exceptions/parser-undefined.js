import { RouterException } from './router.js';

export class ParserUndefinedException extends RouterException {
    get defaultMessage() {
        return 'Parser for router instance is undefined.';
    }

    get exceptionName() {
        return 'ParserUndefinedException';
    }
}
