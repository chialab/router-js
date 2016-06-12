import { RouterException } from './router.js';

export class RouterNotStartedException extends RouterException {
    get defaultMessage() {
        return 'Router has not been started yet.';
    }

    get exceptionName() {
        return 'RouterNotStartedException';
    }
}
