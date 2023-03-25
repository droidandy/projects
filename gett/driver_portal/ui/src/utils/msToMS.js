export default function msToMS(ms) {
  let seconds = ms / 1000
  let minutes = parseInt(seconds / 60, 10)
  seconds = seconds % 3600
  seconds = Math.round(seconds % 60)
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  return `${minutes}:${seconds}`
}
