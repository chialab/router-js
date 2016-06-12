<a name="History"></a>

## History
**Kind**: global class  

* [History](#History)
    * [`new History()`](#new_History_new)
    * [`.current`](#History+current) : <code>Object</code>
    * [`.length`](#History+length) : <code>Integer</code>
    * [`.reset()`](#History+reset)
    * [`.go(shift)`](#History+go) ⇒ <code>Promise</code>
    * [`.back()`](#History+back) ⇒ <code>Promise</code>
    * [`.forward()`](#History+forward) ⇒ <code>Promise</code>
    * [`.indexOfState(state)`](#History+indexOfState) ⇒ <code>Integer</code>
    * [`.pushState(stateObj, title, url)`](#History+pushState) ⇒ <code>Object</code>
    * [`.replaceState(stateObj, title, url)`](#History+replaceState) ⇒ <code>Object</code>

<a name="new_History_new"></a>

### `new History()`
States collector.
An abstraction of the window.history object.

<a name="History+current"></a>

### `history.current` : <code>Object</code>
Get the current state.

**Kind**: instance property of <code>[History](#History)</code>  
**Read only**: true  
<a name="History+length"></a>

### `history.length` : <code>Integer</code>
Get history length.

**Kind**: instance property of <code>[History](#History)</code>  
**Read only**: true  
<a name="History+reset"></a>

### `history.reset()`
Reset index and entries.

**Kind**: instance method of <code>[History](#History)</code>  
<a name="History+go"></a>

### `history.go(shift)` ⇒ <code>Promise</code>
Move in the history.

**Kind**: instance method of <code>[History](#History)</code>  
**Returns**: <code>Promise</code> - A promise which resolves the new current state.  

| Param | Type | Description |
| --- | --- | --- |
| shift | <code>Integer</code> | The shift movement in the history. |

<a name="History+back"></a>

### `history.back()` ⇒ <code>Promise</code>
Move back in the history by one entry. Same as `.go(-1)`

**Kind**: instance method of <code>[History](#History)</code>  
**Returns**: <code>Promise</code> - A promise which resolves the new current state.  
<a name="History+forward"></a>

### `history.forward()` ⇒ <code>Promise</code>
Move forward in the history by one entry. Same as `.go(1)`

**Kind**: instance method of <code>[History](#History)</code>  
**Returns**: <code>Promise</code> - A promise which resolves the new current state.  
<a name="History+indexOfState"></a>

### `history.indexOfState(state)` ⇒ <code>Integer</code>
Find the index of state in the history.

**Kind**: instance method of <code>[History](#History)</code>  
**Returns**: <code>Integer</code> - The position of the searched state in history.  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object</code> | The state to search. |

<a name="History+pushState"></a>

### `history.pushState(stateObj, title, url)` ⇒ <code>Object</code>
Add a state to the history.

**Kind**: instance method of <code>[History](#History)</code>  
**Returns**: <code>Object</code> - The new current state.  

| Param | Type | Description |
| --- | --- | --- |
| stateObj | <code>Object</code> | The state properties. |
| title | <code>String</code> | The state title. |
| url | <code>String</code> | The state path. |

<a name="History+replaceState"></a>

### `history.replaceState(stateObj, title, url)` ⇒ <code>Object</code>
Replace the current state of the history.

**Kind**: instance method of <code>[History](#History)</code>  
**Returns**: <code>Object</code> - The new current state.  

| Param | Type | Description |
| --- | --- | --- |
| stateObj | <code>Object</code> | The state properties. |
| title | <code>String</code> | The state title. |
| url | <code>String</code> | The state path. |

