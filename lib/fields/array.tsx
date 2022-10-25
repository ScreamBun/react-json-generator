/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, FormGroup, FormText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line import/no-cycle
import Field from './field';
import { ArrayDefinition, PropertyDefinition } from './schema';
import { objectValues, safeGet } from './utils';
import { GeneratorContext } from '../context';

// Interfaces
interface ArrayFieldProps {
  def: ArrayDefinition;
  name: string;
  optChange: (name: string, val: any, arr?: boolean) => void;
  required?: boolean;
  parent?: string;
}

interface ArrayFieldState {
  min: boolean;
  max: boolean;
  count: number;
  opts: Record<number, any>;
}

// Component
class ArrayField extends Component<ArrayFieldProps, ArrayFieldState> {
  static contextType = GeneratorContext;
  static defaultProps = {
    name: 'Array',
    parent: ''
  }

  parent: string;
  desc?: string;
  msgName: string;
  opts: {
    min: number;
    max: number;
  }

  constructor(props: ArrayFieldProps) {
    super(props);
    this.addOpt = this.addOpt.bind(this);
    this.optChange = this.optChange.bind(this);
    this.removeOpt = this.removeOpt.bind(this);

    const { def, name, parent } = this.props;

    this.parent = name || '';
    if (parent) {
      this.parent = [parent, name].join('.');
    } else if (name && /^[a-z]/.exec(name)) {
      this.parent = name;
    }

    this.msgName = (parent ? [parent, name] : [name]).join('.');

    this.opts = {
      min: def.minItems || 0,
      max: def.maxItems || 100
    };

    this.state = {
      min: false,
      max: false,
      count: 1,
      opts: {}
    };
  }

  addOpt(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    this.setState(prevState => {
      const { max } = this.opts;
      const maxBool = prevState.count < max;
      return {
        count: maxBool ? prevState.count + 1 : prevState.count,
        max: !maxBool
      };
    }, () => {
      const { name, optChange } = this.props;
      const { max, opts } = this.state;

      optChange(this.parent, Array.from(new Set(objectValues(opts))));
      if (max) {
        console.error(`Cannot have more than ${this.opts.max} items for ${name}`);
      }
    });
  }

  removeOpt(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    this.setState(prevState => {
      const { min } = this.opts;
      const { count, opts } = prevState;
      const minBool = count > min;
      if (minBool) {
        delete opts[Math.max(...Object.keys(opts).map(k => parseInt(k, 10)))];
      }

      return {
        opts,
        count: minBool ? count - 1 : count,
        min: !minBool
      };
    }, () => {
      const { name, optChange } = this.props;
      const { min, opts } = this.state;

      optChange(this.parent, Array.from(new Set(objectValues(opts))));
      if (min) {
        console.error(`Cannot have less than ${this.opts.min} items for ${name}`);
      }
    });
  }

  optChange(_k: string, v: any, ai?: boolean | number) {
    if (typeof ai === 'number') {
      this.setState((prevState) => {
        return {
          opts: {
            ...prevState.opts,
            [ai]: v
          }
        };
      }, () => {
        const { optChange } = this.props;
        const { opts } = this.state;

        optChange(this.parent, [...new Set(objectValues(opts))]);
      });
    }
  }

  render() {
    const { def, name, required } = this.props;
    const { schema } = this.context;
    const { count, max, min } = this.state;

    this.desc = def.description || '';
    const fields = [];

    for (let i = 0; i < count; ++i) {
      if (Array.isArray(def.items)) {
        fields.push(...def.items.map(field => (
          <Field
            key={i}
            def={field}
            optChange={this.optChange}
            idx={i}
            name={'$ref' in field ? field.$ref.replace(/^#\/definitions\//, '') : ''}
            parent={this.parent}
          />
        )));
      } else {
        let fieldName = 'Field';
        let ref = {};

        if ('$ref' in def.items) {
          fieldName = def.items.$ref.replace(/^#\/definitions\//, '');
          ref = safeGet(schema.definitions || {}, fieldName) || {};
        } else if ('type' in def.items) {
          ref = { ...def.items };
        }
        fields.push(
          <Field
            key={i}
            def={ref as PropertyDefinition}
            optChange={this.optChange}
            name={fieldName}
            idx={i}
            parent={this.parent}
          />
        );
      }
    }

    return (
      <FormGroup>
        <Card>
          <CardHeader>
            <ButtonGroup className='float-right'>
              <Button
                color="danger"
                className={classNames('float-right', { 'disabled': min })}
                onClick={this.removeOpt}
              >
                <FontAwesomeIcon icon={faMinusSquare} size="lg" />
              </Button>
              <Button
                color="primary"
                className={classNames('float-right', { 'disabled': max })}
                onClick={this.addOpt}
              >
                <FontAwesomeIcon icon={faPlusSquare} size="lg" />
              </Button>
            </ButtonGroup>
            <CardTitle> <h4 className="inline-block">{name}{required ? <span style={{color:'red'}}>*</span> : ''}</h4>
              {this.desc ? <FormText color="muted">{this.desc}</FormText> : ''}</CardTitle>

            {count == this.opts.max ? <div style={{ color: 'red' }}>REQUIREMENT: Maximum of {this.opts.max} </div> : ''}
            {count == this.opts.min ? <div style={{ color: 'red' }}>REQUIREMENT: Minimum of {this.opts.min} </div> : ''}

          </CardHeader>
          <CardBody className='mx-3'>
            {fields}
          </CardBody>
        </Card>
      </FormGroup>
    );
  }
}

export default ArrayField;
