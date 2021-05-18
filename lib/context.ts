// Message Generator Context
import { createContext, useContext } from 'react';
import { JSONSchema } from './fields/schema';

export interface GeneratorProviderContext {
  schema: JSONSchema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateField?: (k: string, v: any, ai?: boolean|number) => void;
}

export const GeneratorContext = createContext<GeneratorProviderContext>({
  schema: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: '',
    title: '',
    type: 'object',
    oneOf: [],
    definitions: {}
  }
});

export const useGenerator = () => useContext(GeneratorContext);
