module Timezones
  def self.finder
    @finder ||= TimezoneFinder.create
  end

  def self.timezone_at(obj)
    location =
      case obj
      when Hash then obj.symbolize_keys.slice(:lat, :lng)
      when Array then [:lat, :lng].zip(obj).to_h
      when Address, PredefinedAddress then obj.values.slice(:lat, :lng)
      else
        fail(ArgumentError, "Cannot extract :lat and :lng from #{obj.inspect}")
      end

    timezone = finder.timezone_at(location)
    (timezone.nil? || timezone == 'uninhabited') ? Settings.time_zone : timezone
  end
end
