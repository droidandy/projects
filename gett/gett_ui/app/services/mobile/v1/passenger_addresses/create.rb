module Mobile::V1
  module PassengerAddresses
    class Create < ApplicationService
      attributes :passenger, :params

      delegate :errors, to: :passenger_address_service

      def execute!
        return unless passenger_address_service.execute.success?

        passenger_address_service.as_json.tap do |json|
          json['address'].merge!(airport: passenger_address_service.result.address.airport&.iata)
        end
      end

      private def passenger_address_service
        @passenger_address_service ||= ::PassengerAddresses::Create.new(attributes)
      end
    end
  end
end
