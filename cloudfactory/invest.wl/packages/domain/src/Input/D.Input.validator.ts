export class DInputValidator {
  public static required = (value: any, msg = 'Обязательно для заполнения') =>
    value ? undefined : msg;

  public static lengthEq = (value: string = '', len: number, msg = `Значение должно содержать ровно ${len} символов`) =>
    value.length && value.length !== len ? msg : undefined;

  public static lengthMin = (value: string = '', min: number, msg = `Значение должно содержать не менее ${min} символов`) =>
    value.length && value.length < min ? msg : undefined;

  public static lengthMax = (value: string = '', max: number, msg = `Значение должно содержать не более ${max} символов`) =>
    value.length > max ? msg : undefined;

  public static numberRequired = (value = 0, msg = 'Значение не должно быть равно 0') =>
    !!value ? undefined : msg;

  public static numberMin = (value = 0, min?: number, msg = `Минимальное значение ${min}`) =>
    min == null || value >= min ? undefined : msg;

  public static numberMax = (value = 0, max?: number, msg = `Максимальное значение ${max}`) =>
    max == null || value <= max ? undefined : msg;

  public static divisible = (value = 0, divider: number, msg = `Точность ${divider}`) => {
    return (!Number.isFinite(value) || value < divider ||
      parseFloat((value / divider).toFixed(4)) !== Math.round(value / divider)) ? msg : undefined;
  };
}
