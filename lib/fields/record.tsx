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
  parent?: string;
  root?: boolean;
}

interface RecordFieldState {
  open: boolean;
  opts: Record<number, any>;
}

// Component
class RecordField extends Component<RecordFieldProps, RecordFieldState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    name: 'Record',
    required: false,
    parent: '',
    root: false
  }

  parent: string;

  constructor(props: RecordFieldProps) {
    super(props);
    this.optChange = this.optChange.bind(this);

    const { name, parent } = this.props;
    if (parent) {
      this.parent = [parent, name].join('.');
    } else if (name && /^[a-z]/.exec(name)) {
      this.parent = name;
    } else {
      this.parent = '';
    }

    this.state = {
      open: false,
      opts: {}
    };
  }

  optChange(_k: string, v: any) {
    console.log("RECORD : PARENT --- " + this.parent + " ---- KEY :" + _k + " --- VALUE: " + v)

    this.setState((prevState) => {
      return {
        opts: {
          ...prevState.opts,
          [_k]: v
        }
      };
    }, () => {
      const { optChange } = this.props;
      const { opts } = this.state;

      optChange(this.parent, { ...new Object(opts) });
    });
  }

  render() {
    const {
      def, name, required, root
    } = this.props;
    const { open } = this.state;

    const defOpts = Object.keys(def.properties).map(field => (
      <Field
        key={field}
        def={def.properties[field]}
        optChange={this.optChange}
        name={field}
        required={isOptionalJSON(def.required || [], field)}
        parent={this.parent}
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
            <CardTitle><h4>{name}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
              {def.description ? <FormText color="muted">{def.description}</FormText> : ''}   </CardTitle>
          </CardHeader>
          <Collapse isOpen={open}>
            <CardBody className='mx-3'>
              {defOpts.length == 0 ? <div style={{ color: 'red' }}>ERROR: properties of {name} not found</div> : defOpts}
            </CardBody>
          </Collapse>
        </Card>
      </FormGroup>
    );
  }
}

export default RecordField;
