import React, { Component, ContextType } from 'react';
import classNames from 'classnames';
import { Button, FormGroup, FormText } from 'reactstrap';
import { FaMinusSquare, FaPlusSquare } from 'react-icons/fa';
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
  opts: {
    min?: number;
    max?: number;
  };
}

// Component
class ArrayField extends Component<ArrayFieldProps, ArrayFieldState> {
  // eslint-disable-next-line react/static-property-placement
  static contextType: typeof GeneratorContext;
  // eslint-disable-next-line react/static-property-placement
  context!: ContextType<typeof GeneratorContext>;
  // eslint-disable-next-line react/static-property-placement
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
    const { max } = this.opts;

    this.setState(prevState => {
      const maxBool = prevState.count < max;
      return {
        count: maxBool ? prevState.count + 1 : prevState.count,
        max: !maxBool
      };
    }, () => {
      const { name, optChange } = this.props;
      const { opts } = this.state;

      optChange(this.parent, [ ...new Set(objectValues(opts)) ]);
      throw Error(`Cannot have more than ${this.opts.max} items for ${name}`);
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
        count: minBool ? count-1 : count,
        min: !minBool
      };
    }, () => {
      const { name, optChange } = this.props;
      const { min, opts } = this.state;

      optChange(this.parent, [ ...new Set(objectValues(opts)) ]);
      if (min) {
        throw Error(`Cannot have less than ${this.opts.min} items for ${name}`);
      }
    });
  }

  optChange(k: string, v: any, ai?: boolean|number) {
    if (ai && typeof ai === 'number') {
      this.setState((prevState) => {
        return {
          opts: {
            ...prevState.opts,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            [ai]: v
          }
        };
      }, () => {
        const { optChange } = this.props;
        const { opts } = this.state;

        optChange(this.parent, [ ...new Set(objectValues(opts)) ]);
      });
    }
  }

  render() {
    const { schema } = this.context;
    const {
      def, name, required
    } = this.props;
    const { count, max, min } = this.state;

    this.desc = def.description || '';
    const fields = [];

    for (let i=0; i < count; ++i) {
      if (Array.isArray(def.items)) {
        fields.push(...def.items.map(field => (
          <Field
            key={ i }
            def={ field }
            optChange={ this.optChange }
            idx={ i }
            name={ '$ref' in field ? field.$ref.replace(/^#\/definitions\//, '') : '' }
            parent={ this.parent }
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
            key={ i }
            def={ ref as PropertyDefinition }
            optChange={ this.optChange }
            name={ fieldName }
            idx={ i }
            parent={ this.parent }
          />
        );
      }
    }

    return (
      <FormGroup tag="fieldset" className="border border-dark p-2">
        <legend>
          { `${required ? '' : '*'}${name}` }
          <Button
            color="danger"
            className={ classNames('float-right', 'p-1', { 'disabled': min }) }
            onClick={ this.removeOpt }
          >
            <FaMinusSquare size="lg" />
          </Button>
          <Button
            color="primary"
            className={ classNames('float-right', 'p-1', { 'disabled': max }) }
            onClick={ this.addOpt }
          >
            <FaPlusSquare size="lg" />
          </Button>
        </legend>
        { this.desc ? <FormText color="muted">{ this.desc }</FormText> : '' }
        { fields }
      </FormGroup>
    );
  }
}

export default ArrayField;
