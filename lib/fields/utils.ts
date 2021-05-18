// Command Generator Utilities

/**
 * Determine if the given field is optional
 * @param {Array<string>} req required field array
 * @param {string} field field name
 * @returns {boolean} field optionality
 */
export const isOptionalJSON = (req: Array<string>, field: string) => {
  if (req && Array.isArray(req)) {
    return req.includes(field);
  }
  return false;
};

/**
 * Saftely get a property of an object
 * @param {Record<string, Val>} obj Object to get the property of
 * @param {string} key Property of object to get the value of
 * @param {Val} def Default value to return if key does not exist on the object
 * @returns {undefined|Val} the value of the property or a default value
 */
 export const safeGet = <Val>(obj: Record<string, Val>, key: string, def?: Val): undefined|Val => {
  if (key in obj) {
    return obj[key];
  }
  return def;
};

/**
 * Helper function for more compatibility of `Object.values`
 * @param {Record<string, Val>} obj Object to gather the values of
 * @returns {Val} Values of the given object
 */
 export const objectValues = <Val>(obj: Record<string, Val>): Array<Val> => Object.keys(obj).map(k => obj[k]);
