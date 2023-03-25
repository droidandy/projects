class PaymentCardsController < ApplicationController
  include Shared::PaymentCardsController

  def create
    service = PaymentCards::Create.new(passenger: passenger, params: payment_card_params)

    if service.execute.success?
      render json: service.as_json
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def passenger
    @passenger ||= current_company.passengers_dataset.with_pk!(params[:passenger_id])
  end

  private def payment_card_params
    params
      .require(:payment_card)
      .permit(:personal, :token, :card_number, :cvv, :holder_name, :expiration_month, :expiration_year)
  end
end
