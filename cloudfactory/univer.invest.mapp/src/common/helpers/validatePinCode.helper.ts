export function validatePinCode(pincode: string) {
  // первые две цифры в комбинации 19 или 20;
  if (pincode.slice(0, 2) === '19' || pincode.slice(0, 2) === '20') {
    return false;
  }
  const list = pincode.split('');

  let prevPrevElement: number | undefined;
  let prevElement: number | undefined;

  return list.every((el) => {
    const currentEl = parseInt(el, 10);
    // ввод двух одинаковых цифр подряд (х22хх, 33ххх и т.п.);
    if (currentEl === prevElement && !!prevElement) {
      return false;
    }

    // прямые и обратные последовательности более, чем из двух цифр (х123х, 321хх, хх789 и т.п.);
    if (!!prevPrevElement && !!prevElement &&
      ((prevPrevElement === prevElement - 1 && prevElement === currentEl - 1) ||
        (prevElement === prevPrevElement - 1 && currentEl === prevElement - 1))) {
      return false;
    }

    prevPrevElement = prevElement;
    prevElement = currentEl;

    return true;
  });
}
