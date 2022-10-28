/* eslint-disable no-use-before-define */
// JSON Schema Interfaces
// Helpers
type SchemaType = 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string' | 'integer';

// Definitions
interface PropertyReference {
    title?: string;
    $ref: string;
    description?: string;
}

interface BasePropertyDefinition {
    title?: string;
    type: SchemaType
    description?: string;
    format?: string;
}

// Primitive Properties
// Boolean
export interface BooleanDefinition extends BasePropertyDefinition {
    type: 'boolean';
}

// String
export interface StringProperty extends BasePropertyDefinition {
    type: 'string';
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    contentEncoding?: string;
}

// Numeric
export interface NumericProperty extends BasePropertyDefinition {
    type: 'integer' | 'number';
    minimum?: number;
    maximum?: number;
}

// Array
export interface ArrayDefinition extends BasePropertyDefinition {
    type: 'array';
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    prefixItems?: PropertyDefinition | Array<PropertyDefinition>;
    items: PropertyDefinition | Array<PropertyDefinition>;
}

// Enumerated
export interface EnumeratedDefinition {
    title?: string;
    description?: string;
    type: 'integer' | 'number' | 'string';
    oneOf?: Array<{
      const: number | string;
      description: string;
    }>;
    options?: Array<{
      description: string;
      label: string;
      value: string;
    }>;
    enum?: Array<string|number>;
}

// Map
export interface MapDefinition  extends BasePropertyDefinition {
    type: 'object';
    required?: Array<string>;
    minProperties?: number;
    maxProperties?: number;
    properties: {
        [prop: string]: PropertyDefinition;
    }
    patternProperties?: {
        [key: string]: PropertyDefinition;
    };
}

// Choice
export interface ChoiceDefinition extends MapDefinition {
    minProperties: 1;
    maxProperties: 1;
    additionalProperties: false;
}

// Record
export interface RecordDefinition extends MapDefinition {
    additionalProperties: false;
    patternProperties: never;
}

// Schema
// Property Definitions
export type PrimitivePropertyDefinitions = BooleanDefinition | StringProperty | NumericProperty;
export type KnownPropertyDefinition = (
    PrimitivePropertyDefinitions | ArrayDefinition | EnumeratedDefinition | MapDefinition |
    RecordDefinition | BasePropertyDefinition
);
export type PropertyDefinition = KnownPropertyDefinition | PropertyReference;

// Schema Definition
interface BaseSchema {
    $schema: string;
    $id: string;
    title: string;
    description?: string;
    type: 'object';
    definitions: {
        [key: string]: PropertyDefinition;
    };
}

interface OneOfExportSchema extends BaseSchema {
    oneOf: Array<PropertyReference>;
}

interface PropertiesExportSchema extends BaseSchema {
    minProperties: 1;
    maxProperties: 1;
    additionalProperties: false;
    properties: {
        [prop: string]: PropertyReference;
    }
}

// Schema
export type JSONSchema = OneOfExportSchema | PropertiesExportSchema;