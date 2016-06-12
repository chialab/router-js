import { RouterException } from './router.js';

export class RouterNotFoundException extends RouterException {
    get defaultMessage() {
        return 'Router rule has not been found.';
    }

    get exceptionName() {
        return 'RouterNotFoundException';
    }
}
