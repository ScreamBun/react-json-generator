# react-message-generator
A React component to assist in creation of message based on a json schema.

### Install

```
npm install https://github.com/ScreamBun/react-json-generator.git
```

### Setup
The theme switcher works by dynamically modifying the document's style element to switch between the Bootswatch themes. There are two components:

 * A ```Generator``` component that results in a dynamic form for message generation based on a given schema.

The ThemeSwitcher will make sure your app is not displayed until the selected theme is loaded, and will also hide it whenever the ThemeChooser selects a new theme. Here is an example of an app that uses the Redux Provider and React Router rendered in index.js:

```javascript
import { Generator } from 'react-message-generator';

const message_name = 'Message';

const schema = { ... };

const changes = ({ jsObject, isValid, errors }) => {
  console.log(isValid, jsObject);
};

render(
  <Generator
    name={ message_name }
    schema={ schema }
    validate // Validate message against the schema
    onChange={ changes }
  />, document.getElementById('app')
);
```

###Generator props
* ```name``` - String - Name of the top level 'exported' object
* ```schema``` - JSON Schema
* ```onChange``` - Function called when a change occures
* ```validate``` -  Boolean - Validate the message against the given schema
