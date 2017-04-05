## History


#### new History()



States collector.
An abstraction of the window.history object.


























  

### Properties

| Name | Type | Description |
|---|---|---|
| `current` | *`Object`* | Get the current state. |
| `length` | *`Integer`* | Get history length. |


### Methods



#### reset()



Reset index and entries.





























#### go(shift) *&rarr; {Promise}*



Move in the history.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`shift` |*`Integer`* |The shift movement in the history.|








**Returns**:


**Type**: *`Promise`*
A promise which resolves the new current state.


















#### back() *&rarr; {Promise}*



Move back in the history by one entry. Same as `.go(-1)`











**Returns**:


**Type**: *`Promise`*
A promise which resolves the new current state.


















#### forward() *&rarr; {Promise}*



Move forward in the history by one entry. Same as `.go(1)`











**Returns**:


**Type**: *`Promise`*
A promise which resolves the new current state.


















#### indexOfState(state) *&rarr; {Integer}*



Find the index of state in the history.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`state` |*`Object`* |The state to search.|








**Returns**:


**Type**: *`Integer`*
The position of the searched state in history.


















#### pushState(stateObj, title, url) *&rarr; {Object}*



Add a state to the history.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`stateObj` |*`Object`* |The state properties.|
|`title` |*`String`* |The state title.|
|`url` |*`String`* |The state path.|








**Returns**:


**Type**: *`Object`*
The new current state.


















#### replaceState(stateObj, title, url) *&rarr; {Object}*



Replace the current state of the history.





**Parameters:**

| Name |Type | Description |
|---|---|---|
|`stateObj` |*`Object`* |The state properties.|
|`title` |*`String`* |The state title.|
|`url` |*`String`* |The state path.|








**Returns**:


**Type**: *`Object`*
The new current state.