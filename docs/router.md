<a name="Router"></a>

## Router
**Kind**: global class  

* [Router](#Router)
    * [`new Router(options)`](#new_Router_new)
    * _instance_
        * [`.DEFAULTS`](#Router+DEFAULTS) : <code>object</code>
        * [`.parser(path)`](#Router+parser) ⇒ <code>Array</code>
        * [`.reset()`](#Router+reset)
        * [`.getPathFromBase(url)`](#Router+getPathFromBase) ⇒ <code>String</code>
        * [`.trigger(force)`](#Router+trigger) ⇒ <code>Boolean</code>
        * [`.on(filter, callback)`](#Router+on)
        * [`.navigate(path, title, shouldReplace)`](#Router+navigate) ⇒ <code>Boolean</code>
        * [`.back()`](#Router+back) ⇒ <code>Boolean</code>
        * [`.forward()`](#Router+forward) ⇒ <code>Boolean</code>
        * [`.start()`](#Router+start)
        * [`.stop()`](#Router+stop)
        * [`.normalize(path)`](#Router+normalize) ⇒ <code>String</code>
        * [`.resolve(path)`](#Router+resolve) ⇒ <code>String</code>
        * [`.query(url)`](#Router+query) ⇒ <code>Object</code>
    * _static_
        * [`.getPathFromRoot(url)`](#Router.getPathFromRoot) ⇒ <code>String</code>

<a name="new_Router_new"></a>

### `new Router(options)`
Handle application's or component's states.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | A set of options for the router. |

<a name="Router+DEFAULTS"></a>

### `router.DEFAULTS` : <code>object</code>
A list of options for a Router instance.

**Kind**: instance namespace of <code>[Router](#Router)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| base | <code>String</code> | The base pathname for the router (`'#'`). |
| dispatch | <code>Boolean</code> | Should trigger initial state (`true`). |
| bind | <code>Boolean</code> | Should bind to the global `window.history` object (`true`). |

<a name="Router+parser"></a>

### `router.parser(path)` ⇒ <code>Array</code>
Extract the pathname from an URL.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>Array</code> - A list of values for path variables.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The path to parse. |

<a name="Router+reset"></a>

### `router.reset()`
Reset all router rules.

**Kind**: instance method of <code>[Router](#Router)</code>  
<a name="Router+getPathFromBase"></a>

### `router.getPathFromBase(url)` ⇒ <code>String</code>
Parse an URL and get a valid router path.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>String</code> - A valid router path.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The URL to parse. |

<a name="Router+trigger"></a>

### `router.trigger(force)` ⇒ <code>Boolean</code>
Parse the current path and trigger callbacks if a match with rules has been found.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>Boolean</code> - A rule has been matched.  

| Param | Type | Description |
| --- | --- | --- |
| force | <code>Boolean</code> | Should trigger also if path has not been changed. |

<a name="Router+on"></a>

### `router.on(filter, callback)`
Bind a rule.

**Kind**: instance method of <code>[Router](#Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>String</code> | The route rules. |
| callback | <code>function</code> | The callback for the rule. |

<a name="Router+navigate"></a>

### `router.navigate(path, title, shouldReplace)` ⇒ <code>Boolean</code>
Exec a router change.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>Boolean</code> - The navigation has matched a router's rule.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>String</code> |  | The new current path. |
| title | <code>String</code> |  | The title for the new current path. |
| shouldReplace | <code>Boolean</code> | <code>false</code> | Should replace the current state or add a new one. |

<a name="Router+back"></a>

### `router.back()` ⇒ <code>Boolean</code>
Move back in the history.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>Boolean</code> - The history has been navigated.  
<a name="Router+forward"></a>

### `router.forward()` ⇒ <code>Boolean</code>
Move forward in the history.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>Boolean</code> - The history has been navigated.  
<a name="Router+start"></a>

### `router.start()`
Init all history's listeners.
If `options.dispatch === true` => trigger the initial state.
If `options.bind === true` => bind to the global window.history object.

**Kind**: instance method of <code>[Router](#Router)</code>  
<a name="Router+stop"></a>

### `router.stop()`
Remove all history's listeners.

**Kind**: instance method of <code>[Router](#Router)</code>  
<a name="Router+normalize"></a>

### `router.normalize(path)` ⇒ <code>String</code>
Normalize an URL path.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>String</code> - The normalized path.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The path to normalize. |

<a name="Router+resolve"></a>

### `router.resolve(path)` ⇒ <code>String</code>
Create a complete URL for the `window.history.pushState` method.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>String</code> - The complete path.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | A valid router path. |

<a name="Router+query"></a>

### `router.query(url)` ⇒ <code>Object</code>
Parse URL querystring.

**Kind**: instance method of <code>[Router](#Router)</code>  
**Returns**: <code>Object</code> - A key => value object with querystring params.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The URL to parse. |

<a name="Router.getPathFromRoot"></a>

### `Router.getPathFromRoot(url)` ⇒ <code>String</code>
Extract the pathname from an URL.

**Kind**: static method of <code>[Router](#Router)</code>  
**Returns**: <code>String</code> - The pathname.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The URL to parse. |

