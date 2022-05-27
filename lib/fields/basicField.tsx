import React, { CSSProperties, FunctionComponent } from 'react';
import { FormGroup, FormText, Input } from 'reactstrap';
import { PrimitivePropertyDefinitions } from './schema';

// Const Vars
const BasicFieldTypes = [
  'boolean',
  'integer',
  'number',
  'string'
];

// Interfaces
interface BasicFieldProps {
  def: PrimitivePropertyDefinitions;
  name: string;
  optChange: (name: string, val: boolean|number|string, ai?: boolean|number) => void;
  parent?: string;
  required?: boolean;
  root?: boolean;
  arr?: boolean;
}

interface InputOptions {
  type: 'checkbox' | 'number' |'text'
  placeholder?: string;
  style?: CSSProperties,
  onChange: (val: React.ChangeEvent<HTMLInputElement>) => void;
}

// Component
const DefaultProps = {
  name: 'BasicField',
  arr: false,
  required: false,
  parent: ''
};

const BasicField: FunctionComponent<BasicFieldProps> = props => {
  const {
    def, name, optChange, parent, required
  } = { ...DefaultProps, ...props };

  const fieldName = name || def.title || 'Basic Field';
  const msgName = (parent ? [parent, fieldName] : [fieldName]).join('.');

  const change = (val: boolean | string) => {
    const { arr } = props;
    let v: boolean | number | string = val;
    switch (def.type) {
      case 'integer':
        v = parseInt(val as string, 10) || val;
        break;
      case 'number':
        v = parseFloat((val as string).replace(',', '.')) || val;
        break;
      // no default
    }
    optChange(msgName, v, arr);
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const inputOpts = (type: string, _format?: string): InputOptions => {
    // TODO: use the JSON format??
    switch (type) {
      case 'number':
      case 'integer':
        return {
          type: 'number',
          placeholder: '0',
          onChange: e => change(e.target.value)
        };
      case 'boolean':
        return {
          type: 'checkbox',
          style: {
            position: 'inherit',
            marginLeft: 0
          },
          onChange: e => change(e.target.checked)
        };
      default:
        return {
          type: 'text',
          onChange: e => change(e.target.value)
        };
    }
  };

  if (BasicFieldTypes.includes(def.type)) { // name is type if not field
    const opts = inputOpts(def.type, def.format);
    return (
      <FormGroup tag="fieldset" className="border border-dark p-2">
        <legend>{ `${required ? '*' : ''}${fieldName}` }</legend>
        <Input
          { ...opts }
          name={ name }
        />
        { def.description ? <FormText color="muted">{ def.description }</FormText> : '' }
      </FormGroup>
    );
  }
  return (
    <div>
      <p>{ fieldName }</p>
      <p>Not a basic field</p>
    </div>
  );
};

export default BasicField;
