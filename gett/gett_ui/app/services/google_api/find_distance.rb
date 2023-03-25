module GoogleApi
  class FindDistance < Base
    FEET_IN_MILE = 5280

    DISTANCE_MAPPING = {
      'ft' => 'feet',
      'mi' => 'miles'
    }.freeze
    TIME_MAPPING = {
      'mins' => 'minutes',
      'hr' => 'hours'
    }.freeze
    private_constant :FEET_IN_MILE, :DISTANCE_MAPPING, :TIME_MAPPING

    sign_url!
    attributes :origin, :destination

    http_method :get

    normalize_response do
      map from('rows[0]/elements[0]/distance/text'), to('/distance') do |distance_text|
        distance_text&.to_f
      end
      map from('rows[0]/elements[0]/distance/text'), to('/distance_measure') do |distance_text|
        raw = distance_text.split.last
        DISTANCE_MAPPING[raw] || raw
      end
      map from('rows[0]/elements[0]/duration/value'), to('/duration_sec')
      map from('rows[0]/elements[0]/duration/text'), to('/duration_measure') do |duration_text|
        raw = duration_text.split.last
        TIME_MAPPING[raw] || raw
      end
      map from('rows[0]/elements[0]/status'), to('/success') do |param|
        param != 'ZERO_RESULTS'
      end
      map from('status'), to('/status')
    end

    def execute!
      super

      assert { result[:status] == 'OK' && result[:success] } unless result.nil?
    end

    def distance_in_miles
      # Converts distance from feet to miles (only) if needed
      return unless success?

      distance = result[:distance]
      measurement = result[:distance_measure]

      (measurement == 'feet') ? distance / FEET_IN_MILE : distance
    end

    private def url
      url_for(Settings.google_api.distancematrix_url,
        units:        'imperial',
        origins:      normalize_location(origin).join(','),
        destinations: normalize_location(destination).join(','),
        client:       client_id
      )
    end

    private def normalize_location(obj)
      case obj
      when ActionController::Parameters, Hash
        obj.to_h.with_indifferent_access.values_at(:lat, :lng).map(&:to_f)
      when Array
        obj.compact.first(2).map(&:to_f)
      when Address
        [obj.lat, obj.lng]
      else
        fail(ArgumentError, "Cannot normalize #{obj.inspect} as lat-lng pair")
      end
    end
  end
end
