const createActions = function(ns) {
  function creator(name) {
    creator.TYPES[name] = `${ns}/${name}`

    return function(obj = {}) {
      return {
        type: creator.TYPES[name],
        ...obj
      }
    }
  }
  creator.TYPES = {}
  return creator
}

export {
  createActions
}
