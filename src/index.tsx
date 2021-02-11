/* eslint react/static-property-placement: 1 */
import React, { Component } from 'react';
import Ajv, { ErrorObject } from 'ajv';
import { GeneratorContext, GeneratorProviderContext } from './context';
import Field, { JSONSchema } from './fields';
import * as Schema from './fields/schema';
import { delMultiKey, setMultiKey } from './utils';

// Interfaces
export interface GeneratorChanges {
  jsObject: Record<string, any>;
  isValid: boolean;
  errors: Array<ErrorObject>;
}

interface GeneratorProps {
  name: string;
  schema: JSONSchema;
  onChange?: (changes: GeneratorChanges) => void;
  validate?: boolean
}

interface GeneratorState {
  message: {
    action?: string;
    target?: Record<string, any>;
    [prop: string]: any;
  };
  schema: JSONSchema;
  validate: boolean;
}

class Generator extends Component<GeneratorProps, GeneratorState> {
  validator: Ajv.Ajv;

  constructor(props: GeneratorProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
    const { schema, validate } = this.props;
    this.state = {
      message: {},
      validate: validate || false,
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
      const { name, onChange } = this.props;
      if (onChange) {
        const { message, schema, validate } = this.state;
        const changes: GeneratorChanges = {
          jsObject: message,
          isValid: false,
          errors: []
        };
        if (validate) {
          // TODO: Validate message, more options??
          let tmpMsg = message;
          if ('properties' in schema && name in schema.properties) {
            tmpMsg = {
              [name]: message
            };
          }
          try {
            const valid = this.validator.validate(schema, tmpMsg);
            if (!valid && this.validator.errors) {
              changes.errors = this.validator.errors;
            }
          } catch (err) {
            changes.errors.push(err);
          }
          changes.isValid = changes.errors.length === 0;
        }
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
      <GeneratorContext.Provider value={ this.getContext() }>
        <Field
          root
          name={ name }
          def={ schema.definitions[name] }
          optChange={ this.onChange }
        />
      </GeneratorContext.Provider>
    );
  }
}

export default Generator;
export {
  Schema
};