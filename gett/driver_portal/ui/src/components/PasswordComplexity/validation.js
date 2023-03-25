const validate = function(value) {
  if (value.length > 0) {
    /* eslint-disable no-useless-escape */
    const matchGood = /(?=.*[A-Z])(?=.*[$-/:-?{-~!"^_`\[\]#@\\]).{8,}/
    const matchStrong1 = /(?=.*[A-Z])(?=.*[$-\/:-?{-~!"^_`\[\]#@\\].*[$-\/:-?{-~!"^_`\[\]#@\\]).{8,}/
    const matchStrong2 = /(?=.*[A-Z].*[A-Z])(?=.*[$-\/:-?{-~!"^_`\[\]#@\\]).{8,}/
    /* eslint-enable no-useless-escape */
    if (matchStrong1.test(value) || matchStrong2.test(value)) {
      return 'strong'
    }
    if (matchGood.test(value)) {
      return 'good'
    }
    return 'weak'
  } else {
    return false
  }
}

export default validate
