module Mobile::V1
  class PaymentCardsController < ApplicationController
    def create
      service = ::PaymentCards::Create.new(passenger: passenger, params: payment_card_params)

      if service.execute.success?
        render json: service.as_json
      else
        render json: {errors: service.errors}, status: :unprocessable_entity
      end
    end

    def make_default
      service = ::PaymentCards::MakeDefault.new(payment_card: payment_card)

      if service.execute.success?
        head :ok
      else
        head :unprocessable_entity
      end
    end

    def destroy
      service = ::PaymentCards::Destroy.new(payment_card: payment_card)

      if service.execute.success?
        head :ok
      else
        head :unprocessable_entity
      end
    end

    private def payment_card
      @payment_card ||= passenger.payment_cards_dataset.with_pk!(params[:id])
    end

    private def passenger
      @passenger ||= current_company.passengers_dataset.with_pk!(params[:passenger_id])
    end

    private def payment_card_params
      params
        .require(:payment_card)
        .permit(:personal, :card_number, :cvv, :holder_name, :expiration_month, :expiration_year)
    end
  end
end
