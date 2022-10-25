import React, { Component } from 'react';
import {
  Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Collapse, FormGroup, FormText
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line import/no-cycle
import Field from './field';
import { RecordDefinition } from './schema';
import { isOptionalJSON } from './utils';

// Interfaces
interface RecordFieldProps {
  def: RecordDefinition;
  name: string;
  optChange: (name: string, val: any, ai?: boolean | number) => void;
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
        key={field}
        def={def.properties[field]}
        optChange={optChange}
        name={field}
        required={isOptionalJSON(def.required || [], field)}
        parent={this.getParent()}
      />
    ));

    if (root) {
      return defOpts;
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
            <CardTitle><h4>{name}{required ? <span style={{color:'red'}}>*</span> : ''}</h4>
              {def.description ? <FormText color="muted">{def.description}</FormText> : ''}   </CardTitle>
          </CardHeader>
          <Collapse isOpen={open}>
            <CardBody className='mx-3'>
              {defOpts}
            </CardBody>
          </Collapse>
        </Card>
      </FormGroup>
    );
  }
}

export default RecordField;
