module OneTransport
  class ProfileJobsLookup < Base
    attributes :confirmation_number

    normalize_response do
      map from('/jobs/job_structure/stops/stop_structure'), to('/stops') do |stops|
        stops = stops.is_a?(Hash) ? [stops] : stops
        normalize_array(stops) do
          map from('/stop_id'), to('/stop_id')
          map from('/address_details/address/postcode'), to('/postal_code')
          map from('/address_details/location/latitude'), to('/lat')
          map from('/address_details/location/longitude'), to('/lng')
        end
      end
    end

    def options
      {
        o_t_confirmation_number: confirmation_number,
        username: username,
        client_number: client_number
      }
    end
  end
end
