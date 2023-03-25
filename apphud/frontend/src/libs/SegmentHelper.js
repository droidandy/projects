const IDENTIFY_TIMEOUT = 3000

const SegmentHelper = function(params) {
  this.currentTraits = {}
  this.currentCommonFields = {}
}

SegmentHelper.prototype.identify = function(userId, traits, commonFields) {
  const parent = this

  Object.assign(this.currentTraits, traits)
  Object.assign(this.currentCommonFields, commonFields)

  clearTimeout(this.timeout)

  if (window.analytics) {
    this.timeout = setTimeout(() => {
      window.analytics.identify(
        userId,
        this.currentTraits,
        this.currentCommonFields,
        () => {
          parent.currentTraits = {}
          parent.currentCommonFields = {}
        }
      )
    }, IDENTIFY_TIMEOUT)
  } else console.warning("Segment not connected")
}

export default SegmentHelper
