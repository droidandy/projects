module Mobile::V1
  class PassengerAddressesController < ApplicationController
    include ::Shared::PassengerAddressesController

    def create
      service = Mobile::V1::PassengerAddresses::Create.new(passenger: passenger, params: passenger_address_params)

      if service.execute.success?
        render json: service.result
      else
        render json: {errors: service.errors}, status: :unprocessable_entity
      end
    end

    private def passenger
      @passenger ||= current_company.passengers_dataset.with_pk!(params[:passenger_id])
    end
  end
end
