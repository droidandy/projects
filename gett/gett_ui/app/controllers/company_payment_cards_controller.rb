class CompanyPaymentCardsController < ApplicationController
  def show
    service = CompanyPaymentCards::Show.new

    render json: service.execute.result
  end

  def update
    service = CompanyPaymentCards::Update.new(params: payment_card_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def payment_card_params
    params.require(:payment_card).permit(:token, :holder_name)
  end
end
