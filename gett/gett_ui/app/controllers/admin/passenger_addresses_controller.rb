class Admin::PassengerAddressesController < Admin::BaseController
  include Shared::PassengerAddressesController

  private def passenger
    @passenger ||= Member.with_pk!(params[:member_id])
  end
end
