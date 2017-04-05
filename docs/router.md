## Router


#### new Router(options)



Handle application's or component's states.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`options` |*`Object`* |A set of options for the router.**Properties: **
|  | | |
|`base` |*`String`* |The base pathname for the router (`'#'`).|
|`dispatch` |*`Boolean`* |Should trigger initial state (`true`).|
|`bind` |*`Boolean`* |Should bind to the global `window.history` object (`true`).|
|`parser` |*`function`* |The url parser to use (`express`).|
|`triggerHashChange` |*`Boolean`* |Should trigger a new state if only hash has changed (`true`).|
|























  


### Methods



#### reset()



Reset all router rules.





























#### getPathFromBase(url) *&rarr; {String}*



Parse an URL and get a valid router path.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`url` |*`String`* |The URL to parse.|








**Returns**:


**Type**: *`String`*
A valid router path.


















#### trigger(force) *&rarr; {Boolean}*



Parse the current path and trigger callbacks if a match with rules has been found.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`force` |*`Boolean`* |Should trigger also if path has not been changed.|








**Returns**:


**Type**: *`Boolean`*
A rule has been matched.


















#### on(filter, callback)



Bind a rule.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`filter` |*`String`* |The route rules.|
|`callback` |*`function`* |The callback for the rule.|


























#### navigate(path, title, shouldReplace, force) *&rarr; {Promise}*



Exec a router change.





**Parameters:**

| Name |Type | Default | Description |
|---|---|---|---|
|`path` |*`String`* | |The new current path.|
|`title` |*`String`* | |The title for the new current path.|
|`shouldReplace` |*`Boolean`* |false |Should replace the current state or add a new one.|
|`force` |*`Boolean`* |false |Should force the state trigger.|








**Returns**:


**Type**: *`Promise`*
A promise which resolves if the navigation has matched a router's rule.


















#### refresh(path, title, shouldReplace, force) *&rarr; {Promise}*



Helper method for state refresh.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`path` |*`String`* |The new current path.|
|`title` |*`String`* |The title for the new current path.|
|`shouldReplace` |*`Boolean`* |Should replace the current state or add a new one.|
|`force` |*`Boolean`* |Should force the state trigger.|








**Returns**:


**Type**: *`Promise`*
A promise which resolves if the navigation has matched a router's rule.


















#### back() *&rarr; {Promise}*



Move back in the history.











**Returns**:


**Type**: *`Promise`*
A promise which resolves if the history has been navigated.


















#### forward() *&rarr; {Promise}*



Move forward in the history.











**Returns**:


**Type**: *`Promise`*
A promise which resolves if the history has been navigated.


















#### start()



Init all history's listeners.
If `options.dispatch === true` => trigger the initial state.
If `options.bind === true` => bind to the global window.history object.





























#### stop()



Remove all history's listeners.





























#### normalize(path) *&rarr; {String}*



Normalize an URL path.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`path` |*`String`* |The path to normalize.|








**Returns**:


**Type**: *`String`*
The normalized path.


















#### resolve(path) *&rarr; {String}*



Create a complete URL for the `window.history.pushState` method.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`path` |*`String`* |A valid router path.|








**Returns**:


**Type**: *`String`*
The complete path.


















#### query(url) *&rarr; {Object}*



Parse URL querystring.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`url` |*`String`* |The URL to parse.|








**Returns**:


**Type**: *`Object`*
A key => value object with querystring params.


















#### *(static)* getPathFromRoot(url) *&rarr; {String}*



Extract the pathname from an URL.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`url` |*`String`* |The URL to parse.|








**Returns**:


**Type**: *`String`*
The pathname.
