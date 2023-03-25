module PassengerAddresses
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :passenger, :params

    delegate :errors, to: :passenger_address

    def self.policy_class
      Passengers::UpdatePolicy
    end

    def execute!
      passenger_address.set(passenger_address_params)
      assign_address(passenger_address, address_params)
    end

    def errors
      passenger_address.errors.transform_keys do |key|
        (key == :address_id) ? :address : key
      end
    end

    def as_json
      passenger_address.as_json(only: [:id, :passenger_id, :name, :type, :pickup_message, :destination_message], include: :address)
    end

    private def passenger_address
      @passenger_address ||= PassengerAddress.new(passenger_id: passenger.id)
    end

    private def passenger_address_params
      params.slice(:name, :type, :pickup_message, :destination_message)
    end

    private def address_params
      params[:address]
    end
  end
end
