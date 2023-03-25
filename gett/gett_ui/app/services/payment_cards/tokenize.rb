module PaymentCards
  class Tokenize < ApplicationService
    include ApplicationService::ModelMethods

    attributes :payment_card

    def execute!
      token = retreive_token
      result { update_model(payment_card, token: token) } if token.present?
    end

    private def retreive_token
      PaymentsOS::CreateToken.new(card_params: payments_os_params).execute.result
    end

    private def payments_os_params
      # card number and cvv are attr_accessor's and are not persisted
      {
        card_number:      payment_card.card_number,
        cvv:              payment_card.cvv,
        holder_name:      payment_card.holder_name,
        expiration_month: payment_card.expiration_month,
        expiration_year:  payment_card.expiration_year
      }
    end
  end
end
