const dataURLtoFile = function(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

const fileName = function(filename, maxLength) {
  return filename && (filename.length > (maxLength || 15) ? `${filename.substring(0, (maxLength || 15))}...` : filename)
}

export {
  dataURLtoFile,
  fileName
}
