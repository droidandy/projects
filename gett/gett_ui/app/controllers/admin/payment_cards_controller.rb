class Admin::PaymentCardsController < Admin::BaseController
  include Shared::PaymentCardsController

  private def passenger
    @passenger ||= Member.with_pk!(params[:member_id])
  end
end
