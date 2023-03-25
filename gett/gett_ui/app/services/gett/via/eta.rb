module Gett::Via
  class Eta < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::NormalizedResponse

    attributes :pickup_address, :destination_address

    normalize_response do
      map from('/service_available'), to('/available')
      map from('/trip_quotes'), to('/etas') do |list|
        normalize_array(list) do
          map from('/pickup_eta_max'), to('/eta') do |epoch_eta|
            ((Time.at(epoch_eta) - Time.current) / 1.minute).round
          end
        end
      end
    end

    private def execute!
      # skip all requests to external service and return stub; this needed because via sandbox return nothing
      return 42 if Settings.via.disabled

      get(url, default_headers)

      return unless normalized_response.present? && normalized_response.key?(:etas)
      return if normalized_response.key?(:available) && !normalized_response[:available]

      normalized_response[:etas].map(&:values).flatten.max
    end

    private def default_headers
      {
        content_type: 'application/json',
        authorization: auth_token,
        'x-api-key': ::Settings.via.x_api_key
      }
    end

    private def auth_token
      ::Gett::Via::AuthToken.new.execute.result
    end

    private def url
      "#{::Settings.via.api_url}/trips/quote?#{params.to_query}"
    end

    private def params
      {
        origin: to_address_params(pickup_address).to_json,
        destination: to_address_params(destination_address).to_json
      }
    end

    private def to_address_params(address)
      if address.present?
        address
          .slice(:city, :postal_code, :lat, :lng)
          .merge(
            state: address[:region],
            address: address[:line],
            country: '',
            description: ''
          )
      else
        {
          city: '',
          postal_code: '',
          lat: 0,
          lng: 0,
          state: '',
          address: '',
          country: '',
          description: ''
        }
      end
    end
  end
end
