import { RouterException } from './router.js';

export class OutOfHistoryException extends RouterException {
    get defaultMessage() {
        return 'Out of history navigation.';
    }

    get exceptionName() {
        return 'OutOfHistoryException';
    }
}
