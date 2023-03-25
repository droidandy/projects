module PaymentCards
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :passenger, :params

    delegate :errors, to: :payment_card

    def execute!
      token_provided? ? create_with_token : create_without_token
    end

    private def create_with_token
      card_info = token_info_service.execute.result || {}
      create_model(payment_card, params.merge(card_info))
    end

    private def create_without_token
      transaction do
        result { create_model(payment_card, params) }
        if payment_card.persisted?
          assert { tokenize_payment_card }
        end
      end
    end

    def as_json
      payment_card.as_json(
        only: [:id, :holder_name, :last_4, :expiration_year, :expiration_month, :default],
        include: [:kind]
      )
    end

    private def token_provided?
      params[:token].present?
    end

    private def payment_card
      @payment_card ||=
        PaymentCard.new(passenger_id: passenger.id, default: default_payment_card?)
    end

    private def default_payment_card?
      @default_payment_card ||= passenger.payment_cards.empty?
    end

    private def tokenize_payment_card
      service = Tokenize.new(payment_card: payment_card)

      service.execute.success? || begin
        payment_card.errors.add(:token, I18n.t('payment_card.errors.token_invalid'))
        false
      end
    end

    private def token_info_service
      @token_info_service ||= PaymentsOS::GetTokenInfo.new(token: params[:token])
    end
  end
end
