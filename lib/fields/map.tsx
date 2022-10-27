import React, { Component } from 'react';
import {
  Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Collapse, FormGroup, FormText
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line import/no-cycle
import Field from './field';
import { MapDefinition } from './schema';
import { isOptionalJSON } from './utils';

// Interfaces
export interface MapFieldProps {
  def: MapDefinition;
  name: string;
  optChange: (name: string, val: any, ai?: boolean | number) => void;
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

    const defOpts: Array<JSX.Element> = [];
    if ('properties' in def) {
      defOpts.push(...Object.keys(def.properties).map(field => (
        <Field
          key={field}
          def={def.properties[field]}
          optChange={optChange}
          name={field}
          required={isOptionalJSON(def.required || [], field)}
          parent={this.getParent()}
        />
      )));
    }

    if (def.patternProperties) {
      // TODO: Pattern Properties
      console.warn('Map Pattern Props', def.patternProperties);
    }
    const icon = open ? faMinusSquare : faPlusSquare;
    return (
      <FormGroup>
        <Card>
          <CardHeader>
            <ButtonGroup className='float-right'>
              <Button
                color={open ? 'primary' : 'info'}
                className='float-right'
                onClick={() => this.setState(prevState => ({ open: !prevState.open }))}
              >
                <FontAwesomeIcon icon={icon} size="lg" />
              </Button>
            </ButtonGroup>
            <CardTitle><h4>{name}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
              {def.description ? <FormText color="muted">{def.description}</FormText> : ''}</CardTitle>
          </CardHeader>
          <Collapse isOpen={open}>
            <CardBody className='mx-3'>
              {defOpts.length == 0 ? <div style={{ color: 'red' }}>ERROR: properties of { name } is not found</div> : defOpts}
            </CardBody>
          </Collapse>
        </Card>
      </FormGroup>
    );
  }
}

export default MapField;
