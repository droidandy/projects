module DriversApi
  class SendWholeDriver < ApplicationService
    schema do
      required(:driver).filled
    end

    def initialize(params)
      super(nil, params)
    end

    def execute!
      return fail! unless compose(DriversApi::Drivers::Send.new(nil, user: driver))

      driver.documents.approved_approval_status.each do |document|
        return fail! unless compose(DriversApi::Documents::Send.new(nil, document: document))
      end

      driver.vehicles.approved_approval_status.each do |vehicle|
        return fail! unless compose(DriversApi::Cars::Send.new(nil, vehicle: vehicle))

        vehicle.documents.approved_approval_status.each do |document|
          return fail! unless compose(DriversApi::Documents::Send.new(nil, document: document))
        end
      end

      success!
    end
  end
end
