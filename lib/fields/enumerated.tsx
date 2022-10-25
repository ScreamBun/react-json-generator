import React, { FunctionComponent } from 'react';
import { FormGroup, FormText, Input } from 'reactstrap';
import { EnumeratedDefinition } from './schema';

// Interfaces
interface EnumeratedFieldProps {
  def: EnumeratedDefinition;
  name: string;
  optChange: (name: string, val: number | string) => void;
  required?: boolean;
  parent?: string;
}

// Component
const DefaultProps = {
  name: 'Enumerated',
  required: false,
  parent: ''
};

const EnumeratedField: FunctionComponent<EnumeratedFieldProps> = props => {
  const {
    def, name, optChange, parent, required
  } = { ...DefaultProps, ...props };

  const getParent = () => {
    let rtn = '';
    if (parent) {
      rtn = [parent, name].join('.');
    } else if (name && /^[a-z]/.exec(name)) {
      rtn = name;
    }
    return rtn;
  };

  const change = (val: string) => {
    let v: number | string = val;
    switch (def.type) {
      case 'integer':
        v = parseInt(val, 10) || val;
        break;
      case 'number':
        v = parseFloat(val.replace(',', '.')) || val;
        break;
      // no default
    }
    optChange(getParent(), v);
  };

  let defOpts = [];

  if (def.options) {
    defOpts = def.options.map(opt => (
      <option key={opt.value} value={opt.value} data-subtext={opt.description}>{opt.label}</option>
    ));
  } else if (def.enum) {
    defOpts = def.enum.map(opt => (
      <option key={opt} value={opt} data-subtext={opt}>{opt}</option>
    ));
  } else if (def.oneOf) {
    defOpts = def.oneOf.map(opt => (
      <option key={opt.const} value={opt.const} data-subtext={opt.description}>{opt.const}</option>
    ));
  } else {
    defOpts = [<option key={0} value="">Unknown Enumerated format</option>];
  }

  return (
    <FormGroup>
      <h4>{name}{required ? <span style={{color:'red'}}>*</span> : ''}</h4>
      {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
      <Input
        type="select"
        name={name}
        title={name}
        className="selectpicker"
        onChange={e => change(e.target.value)}
      >
        <option data-subtext={`${name} options`} value='' >{`${name} options`}</option>
        {defOpts}
      </Input>
    </FormGroup>
  );
};

export default EnumeratedField;
