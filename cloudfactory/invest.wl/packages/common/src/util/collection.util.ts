export function objWithoutUndefined<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) delete result[key];
  }

  return result;
}

export type EnumValueType = string | number | any;
type EnumType = Record<string, EnumValueType>;

export class EnumValues {
  public static getNamesAndValues<E extends EnumType, V extends E[keyof E]>(e: E): { name: keyof E; value: V }[] {
    return this.getNames(e).map(_name => ({ name: _name, value: e[_name] as V }));
  }

  public static getNames<E extends EnumType>(e: E): (keyof E)[] {
    return Object.keys(e).filter(key => isNaN(+key));
  }

  public static getNameFromValue<E extends EnumType, V extends E[keyof E]>(e: E, value: V): keyof E | null {
    const all = this.getNamesAndValues(e).filter(pair => pair.value === value);
    return all.length === 1 ? all[0].name : null;
  }

  public static getValues<E extends EnumType, V extends E[keyof E]>(e: E): V[] {
    return this.getNames(e).map(name => e[name]);
  }

  public static getLength(e: any) {
    return Object.keys(e).length / 2;
  }
}

export function makeArrayWithNumbers(length: number): number[] {
  const data = [];
  for (let i = 0; i < length; i++) { data.push(i); }
  return data;
}
