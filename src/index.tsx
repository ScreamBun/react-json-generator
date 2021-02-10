import React, { Component } from 'react';
import Ajv, { ErrorObject } from 'ajv';
import { GeneratorProvider as Provider, GeneratorProviderContext } from './context';
import Field, { JSONSchema } from './fields';
import { delMultiKey, setMultiKey } from './utils';

// Interfaces
interface GeneratorChanges {
  jsObject: Record<string, any>;
  isValid: boolean;
  errors: Array<ErrorObject>;
}

interface GeneratorProviderProps {
  name: string;
  schema: JSONSchema;
  onChange?: (changes: GeneratorChanges) => void;
}

interface GeneratorProviderState {
  message: {
    action?: string;
    target?: Record<string, any>;
    [prop: string]: any;
  };
  schema: JSONSchema;
  validate?: boolean;
}

class GeneratorProvider extends Component<GeneratorProviderProps, GeneratorProviderState> {
  validator: Ajv.Ajv;

  constructor(props: GeneratorProviderProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
    const { schema } = props;
    this.state = {
      message: {},
      schema
    };

    this.validator = new Ajv({
      // unknownFormats: 'ignore'
    });
  }

  onChange(key: string, val: any, _ai?: boolean|number) {
    this.setState(prevState => {
      const { message } = prevState;
      const keys = key.split('.');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (keys.length > 1 && message[keys[0]] && !message[keys[0]][keys[1]]) {
        delMultiKey(message, keys[0]);
      }
      if (['', ' ', null, undefined, [], {}].includes(val)) {
        delMultiKey(message, key);
      } else {
        setMultiKey(message, key, val);
      }
      return {
        message
      };
    },
    () => {
      const { onChange } = this.props;
      if (onChange) {
        const { message, schema, validate } = this.state;
        const changes: GeneratorChanges = {
          jsObject: message,
          isValid: false,
          errors: []
        };
        if (validate) {
          try {
            const valid = this.validator.validate(schema, message);
            if (!valid) {
              changes.errors = this.validator.errors || [];
            }
          } catch (err) {
            changes.errors.push(err);
          }
          changes.isValid = changes.errors.length === 0;
        }
        console.log(changes);
        onChange(changes);
      }
    });
  }

  getContext(): GeneratorProviderContext {
    const { schema } = this.state;
    return {
      schema
    };
  }

  render() {
    const { name } = this.props;
    const { schema } = this.state;
    if (!schema) {
      return <p>No Schema given</p>;
    }

    if (!(name in schema.definitions)) {
      throw new Error(`${name} is not definied in schema.definitions`);
    }

    return (
      <Provider value={ this.getContext() }>
        <Field
          root
          name={ name }
          def={ schema.definitions[name] }
          optChange={ this.onChange }
        />
      </Provider>
    );
  }
}


export default GeneratorProvider;
