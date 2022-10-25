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
  optChange: (name: string, val: boolean | number | string, ai?: boolean | number) => void;
  parent?: string;
  required?: boolean;
  root?: boolean;
  arr?: boolean;
}

interface InputOptions {
  type: 'checkbox' | 'number' | 'text'
  placeholder?: string;
  style?: CSSProperties;
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
            display: 'inline',
            height: '1rem', 
            width: '1rem'
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
      <FormGroup>
        <h4>{fieldName}{required ? <span style={{color:'red'}}>*</span> : ''}</h4>
        <Input
          {...opts}
          name={name}
        />
        {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
      </FormGroup>
    );
  }
  return (
    <FormGroup>
      <h4>{fieldName}{required ? <span style={{color:'red'}}>*</span> : ''}</h4>
      <p style={{ color: 'red' }}>ERROR: Field type is undefined</p>
    </FormGroup>
  );
};

export default BasicField;
