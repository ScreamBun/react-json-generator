# react-message-generator
A React component to assist in creation of message based on a json schema.

### Install

```
npm install https://github.com/czack425/react-json-generator.git
```

### Setup
The theme switcher works by dynamically modifying the document's style element to switch between the Bootswatch themes. There are two components:

 * A ```ThemeSwitcher``` component that wraps your top-level component. This is responsible for theme loading and hiding your app during the load.
 * A ```ThemeChooser``` component that displays a dropdown button select menu allowing the user to choose a theme.

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
