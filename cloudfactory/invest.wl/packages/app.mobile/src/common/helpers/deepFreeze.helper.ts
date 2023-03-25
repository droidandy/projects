// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
// Чтобы сделать объект obj полностью неизменяемым, замораживаем каждый объект в объекте obj.
// Для этого воспользуемся этой функцией.
export function deepFreeze(obj: any) {
  // Иначе Object.getOwnPropertyNames выдаст TypeError: can't convert null to object
  if (!obj) { return obj; }

  // Получаем имена свойств из объекта obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Замораживаем свойства для заморозки самого объекта
  propNames.forEach(name => {
    const prop = obj[name];

    // Заморозка свойства prop, если оно объект
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });

  // Заморозить сам объект obj (ничего не произойдёт, если он уже заморожен)
  return Object.freeze(obj);
}
