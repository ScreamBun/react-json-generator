import React, { FunctionComponent } from 'react';
import {
  ArrayDefinition, ChoiceDefinition, KnownPropertyDefinition, MapDefinition,
  PrimitivePropertyDefinitions, PropertyDefinition, RecordDefinition
} from './schema';
// eslint-disable-next-line import/no-cycle
import {
  ArrayField, BasicField, ChoiceField, EnumeratedField, MapField, RecordField
} from '.';
import { safeGet } from './utils';
import { useGenerator } from '../context';

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
const DefaultProps = {
  root: false,
  parent: ''
};

const Field: FunctionComponent<FieldProps> = props => {
  const { schema } = useGenerator();
  const {
    def, idx, name, optChange, parent, required, root
  } = { ...DefaultProps, ...props };

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
    name: name || fieldDef.title || 'Field',
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
        case (minProps >= 1 && maxProps == null):
          return <MapField def={ fieldDef as MapDefinition } { ...fieldArgs } />;
        case ('properties' in fieldDef || (minProps == null && maxProps == null)):
          return <RecordField def={ fieldDef as RecordDefinition } { ...fieldArgs } />;
        default:
          return (
            <p>
              <strong>Object</strong>
              :&nbsp;
              { name }
            </p>
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
};

export default Field;
