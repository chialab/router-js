/**
 * Check if browser context.
 * @type {Boolean}
 */
const IS_BROWSER = typeof window !== 'undefined';

/**
 * Browser's History object.
 * @type {Object}
 */
export const HISTORY = IS_BROWSER && window.history;

/**
 * Browser's Location object.
 * @type {Object}
 */
export const LOCATION = IS_BROWSER && (HISTORY && HISTORY.location || window && window.location);

/**
 * Browser's Document object.
 * @type {HTMLDocument}
 */
export const DOCUMENT = IS_BROWSER && window.document;
