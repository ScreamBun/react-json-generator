import React, { Component } from 'react';
import { Button, Col, FormGroup, FormText, Input, Row } from 'reactstrap';
import { PrimitivePropertyDefinitions } from './schema';
import { v4 as uuid4 } from 'uuid';

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

interface BasicFieldState {
  value: any;
}

// Component
class BasicField extends Component<BasicFieldProps, BasicFieldState> {
  static defaultProps = {
    name: 'BasicField',
    arr: false,
    required: false,
    parent: ''
  };

  constructor(props: BasicFieldProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = { value: '' }
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

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { arr } = this.props;

    this.setState({
      value: e.target.value
    }, () => {
      const { def, optChange } = this.props;
      const { value } = this.state;

      let v: boolean | number | string = value;

      switch (def.type) {
        case 'integer':
          v = parseInt(value as string, 10) || value;
          break;
        case 'number':
          v = parseFloat((value as string).replace(',', '.')) || value;
          break;
        default:
          v = value;
      }

      optChange(this.getParent(), v, arr);
    });
  }


  makeID = () => {
    const { arr, optChange } = this.props;

    const randomID = uuid4();
    this.setState({ value: randomID });
    optChange(this.getParent(), randomID, arr);
  }

  render() {
    const {
      def, name, required
    } = this.props;

    const { value } = this.state;

    const fieldName = name || def.title || '';

    if (BasicFieldTypes.includes(def.type)) { // name is type if not field
      switch (def.type) {
        case 'number':
        case 'integer':
          return (
            <FormGroup>
              <h4>{fieldName}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
              <Input
                type='number'
                placeholder='0'
                name={name}
                parent={this.getParent()}
                onChange={this.handleChange}
                value={value}
              />
              {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
            </FormGroup>
          );
        case 'boolean':
          return (
            <FormGroup>
              <h4>{fieldName}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
              <Input
                type='checkbox'
                name={name}
                parent={this.getParent()}
                onChange={this.handleChange}
                value={value}
              />
              {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
            </FormGroup>
          );
        default:
          if (name == "command_id") {
            return (
              <Row className="align-items-center">
                <Col className='col-9'>
                  <FormGroup>
                    <h4>{fieldName}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
                    <Input
                      type='text'
                      name={name}
                      parent={this.getParent()}
                      onChange={this.handleChange}
                      value={value}
                    />
                    {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
                  </FormGroup>
                </Col>
                <Col className='col-3'>
                  <Button color='primary' onClick={this.makeID}>Generate ID</Button>
                </Col>
              </Row>
            )


          } else {
            return (
              <FormGroup>
                <h4>{fieldName}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
                <Input
                  type="text"
                  name={name}
                  parent={this.getParent()}
                  onChange={this.handleChange}
                  value={value}
                />
                {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
              </FormGroup>
            );
          }
      }
    }
    return (
      <FormGroup>
        <h4>{fieldName}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
        <div style={{ color: 'red' }}>ERROR: Field type not found</div>
      </FormGroup>
    );
  };
}
export default BasicField;

