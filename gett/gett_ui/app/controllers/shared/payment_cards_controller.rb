module Shared::PaymentCardsController
  def make_default
    service = PaymentCards::MakeDefault.new(payment_card: payment_card)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def destroy
    service = PaymentCards::Destroy.new(payment_card: payment_card)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def payment_card
    @payment_card ||= passenger.payment_cards_dataset.with_pk!(params[:id])
  end
end
