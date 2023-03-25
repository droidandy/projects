module CompanyPaymentCards
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :params
    delegate :company, to: :context
    delegate :errors, to: :payment_card

    def self.policy_class
      CompanyPaymentCards::Policy
    end

    def execute!
      transaction do
        deactivate_payment_card
        result { create_model(payment_card, params.merge(card_info)) }
        company.reload
        assert { create_payment } if success?
      end
    end

    def show_result
      CompanyPaymentCards::Show.new.execute.result
    end

    private def payment_card
      @payment_card ||= PaymentCard.new(company: company)
    end

    private def deactivate_payment_card
      company.payment_card&.deactivate!
    end

    private def create_payment
      InvoicePayments::CreateAutomatic.new(company: company).execute.success?
    end

    private def token_info_service
      @token_info_service ||= PaymentsOS::GetTokenInfo.new(token: params[:token])
    end

    private def card_info
      token_info_service.execute.result || {}
    end
  end
end
