// Command Generator Utilities

export const isOptionalJSON = (req: Array<string>, field: string) => {
  if (req && Array.isArray(req)) {
    return req.includes(field);
  }
  return false;
};

export const safeGet = <Val>(obj: Record<string, Val>, key: string, def?: Val): undefined|Val => {
  if (key in obj) {
    return obj[key];
  }
  return def;
};

export const objectValues = <Value>(obj: Record<string, Value>): Array<Value> => Object.keys(obj).map(k => obj[k]);
