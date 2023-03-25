module Orders
  class Parser
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def parse
      {
        id: data['id'],
        origin: location_data('origin'),
        destination: location_data('destination'),
        dropoff: location_data('dropoff'),
        events: events,
        distance: data['distance'],
        path: path
      }
    end

    private def events
      {
        scheduled_at: time('scheduled_at'),
        arrived_at: time('arrived_at'),
        started_at: time('started_at'),
        ended_at: time('ended_at'),
        cancelled_at: time('cancelled_at')
      }.reject { |_, v| v.nil? }
    end

    private def path
      Array.wrap(data['path']).map do |point|
        {
          lat: point[0],
          lng: point[1]
        }
      end
    end

    private def location_data(location_type)
      location = data[location_type]
      return unless location
      {
        full_address: location['address'],
        latitude: location['lat'].to_f,
        longitude: location['lon'].to_f
      }
    end

    private def time(*path)
      time = data.dig(*path)
      Time.zone.parse(time).iso8601 if time
    end
  end
end
