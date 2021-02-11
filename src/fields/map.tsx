import React, { Component } from 'react';
import {
  Button, Collapse, FormGroup, FormText
} from 'reactstrap';
import { FaMinusSquare, FaPlusSquare } from 'react-icons/fa';
// eslint-disable-next-line import/no-cycle
import Field from './field';
import { MapDefinition } from './schema';
import { isOptionalJSON } from './utils';

// Interfaces
export interface MapFieldProps {
  def: MapDefinition;
  name: string;
  optChange: (name: string, val: any, ai?: boolean|number) => void;
  required?: boolean;
  parent?: string;
}

interface MapFieldState {
  open: boolean;
}

// Component
class MapField extends Component<MapFieldProps, MapFieldState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    name: 'Map',
    required: false,
    parent: ''
  }

  constructor(props: MapFieldProps) {
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
      def, name, optChange, required
    } = this.props;
    const { open } = this.state;

    const defOpts = Object.keys(def.properties).map(field => (
      <Field
        key={ field }
        def={ def.properties[field] }
        optChange={ optChange }
        name={ field }
        parent={ this.getParent() }
        required={ isOptionalJSON(def.required || [], field) }
      />
    ));

    if (def.patternProperties) {
      // TODO: Pattern Properties
      console.warn('Map Pattern Props', def.patternProperties);
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
            <Icon size="1.5em" />
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

export default MapField;
