module PassengerAddresses
  class Destroy < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :passenger_address

    delegate :passenger, to: :passenger_address

    def self.policy_class
      Passengers::UpdatePolicy
    end

    def execute!
      destroy_model(passenger_address)
    end
  end
end
