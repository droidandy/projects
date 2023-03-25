class PassengerAddressesController < ApplicationController
  include Shared::PassengerAddressesController

  private def passenger
    @passenger ||= current_company.passengers_dataset.with_pk!(params[:passenger_id])
  end
end
