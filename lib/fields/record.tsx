import React, { Component } from 'react';
import {
  Button, Collapse, FormGroup, FormText
} from 'reactstrap';
import { FaMinusSquare, FaPlusSquare } from 'react-icons/fa';
// eslint-disable-next-line import/no-cycle
import Field from './field';
import { RecordDefinition } from './schema';
import { isOptionalJSON } from './utils';

// Interfaces
interface RecordFieldProps {
  def: RecordDefinition;
  name: string;
  optChange: (name: string, val: any, ai?: boolean|number) => void;
  required?: boolean;
  root?: boolean;
  parent?: string;
}

interface RecordFieldState {
  open: boolean;
}

// Component
class RecordField extends Component<RecordFieldProps, RecordFieldState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    name: 'Record',
    required: false,
    root: false,
    parent: ''
  }

  constructor(props: RecordFieldProps) {
    super(props);

    this.state = {
      open: false
    };
  }

  getParent() {
    const { name, parent } = this.props;

    let rtn = '';
    if (parent) {
      rtn = [parent, name].join('.');
    } else if (name && /^[a-z]/.exec(name)) {
      rtn = name;
    }
    return rtn;
  }

  render() {
    const {
      def, name, optChange, required, root
    } = this.props;
    const { open } = this.state;

    const defOpts = Object.keys(def.properties).map(field => (
      <Field
        key={ field }
        def={ def.properties[field] }
        optChange={ optChange }
        name={ field }
        required={ isOptionalJSON(def.required || [], field) }
        parent={ this.getParent() }
      />
    ));

    if (root) {
      return defOpts;
    }
    const Icon = open ? FaMinusSquare : FaPlusSquare;
    return (
      <FormGroup tag="fieldset" className="border border-dark p-2">
        <legend>
          <Button
            color={ open ? 'primary' : 'info' }
            className='float-right p-1'
            onClick={ () => this.setState(prevState => ({ open: !prevState.open })) }
          >
            <Icon size="1.3333333333em" />
          </Button>
          { `${required ? '*' : ''}${name}` }
        </legend>
        { def.description ? <FormText color="muted">{ def.description }</FormText> : '' }
        <Collapse isOpen={ open }>
          <div className="col-12 my-1 px-0">
            { defOpts }
          </div>
        </Collapse>
      </FormGroup>
    );
  }
}

export default RecordField;
