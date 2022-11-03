/* eslint react/static-property-placement: 1 */
import React, { Component } from 'react';
// eslint-disable-next-line import/no-cycle
import {
  ArrayField, BasicField, ChoiceField, EnumeratedField, RecordField
} from '.';
import {
  ArrayDefinition, ChoiceDefinition, KnownPropertyDefinition, 
  PrimitivePropertyDefinitions, PropertyDefinition, RecordDefinition
} from './schema';
import { safeGet } from './utils';
import { GeneratorContext } from '../context';

// Interfaces
export interface FieldProps {
  def: PropertyDefinition;
  name: string;
  optChange: (name: string, val: any, ai?: boolean|number) => void;
  idx?: number;
  root?: boolean;
  parent?: string;
  required?: boolean;
}

// Component
class Field extends Component<FieldProps> {
  static contextType = GeneratorContext;
  static defaultProps = {
    name: 'Field',
    root: false,
    parent: ''
  }

  render() {
    const { schema } = this.context;
    const {
      def, idx, name, optChange, parent, required, root
    } = this.props;

    let field: Partial<PropertyDefinition> = { ...def };

    if ('$ref' in field && field.$ref) {
      const refName = field.$ref.replace(/^#\/definitions\//, '');
      delete field.$ref;

      if (schema.definitions) {
        field = {
          ...schema.definitions[refName],
          ...field
        };
      }
    }

    const fieldDef = field as KnownPropertyDefinition;
    const fieldArgs = {
      optChange: (k: string, v: any) => optChange(k, v, idx),
      root,
      parent,
      name: name || fieldDef.title || '',
      required
    };

    switch (fieldDef.type) {
      case 'object':
        // eslint-disable-next-line no-case-declarations
        const minProps = safeGet<number>(fieldDef as Record<string, any>, 'minProperties') || 0;
        // eslint-disable-next-line no-case-declarations
        const maxProps = safeGet<number|null>(fieldDef as Record<string, any>, 'maxProperties', null);
        switch (true) {
          case (minProps === 1 && maxProps === 1):
            return <ChoiceField def={ fieldDef as ChoiceDefinition } { ...fieldArgs } />;
          case ('properties' in fieldDef):
            return <RecordField def={ fieldDef as RecordDefinition } { ...fieldArgs } />;
          default:
            return (
              <div style={{ color: 'red' }}>ERROR: Properties of { name } not found</div>
                
            );
        }
      case 'array':
        return <ArrayField def={ fieldDef as ArrayDefinition } { ...fieldArgs } />;
      default:
        if ('enum' in fieldDef || 'oneOf' in fieldDef) {
          return <EnumeratedField def={ fieldDef } { ...fieldArgs } />;
        }
        return <BasicField def={ fieldDef as PrimitivePropertyDefinitions } { ...fieldArgs } />;
    }
  }
}

export default Field;
