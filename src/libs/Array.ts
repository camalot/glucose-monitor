export default class ArrayUtility { 
  static wrap(value: any): any[] { 
    return value instanceof Array ? value : [value]; 
  }
}