require 'go_cardless_client_builder'

module DirectDebitMandates
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    delegate :company, :member, to: :context

    DESCRIPTION = 'One Transport Limited'.freeze

    def self.policy_class
      DirectDebitMandates::Policy
    end

    def execute!
      return if mandate.active?

      redirect_flow = client.redirect_flows.create(
        params: {
          description: DESCRIPTION,
          session_token: member.id.to_s,
          success_redirect_url: redirect_url
        }
      )

      result { redirect_flow.redirect_url }

      assert do
        update_model(
          mandate,
          go_cardless_redirect_flow_id: redirect_flow.id,
          created_by: member,
          status: DirectDebitMandate::INITIATED
        )
      end
    end

    private def client
      @client ||= GoCardlessClientBuilder.build
    end

    private def mandate
      @mandate ||= company.direct_debit_mandate || DirectDebitMandate.new(company: company)
    end

    private def redirect_url
      host = Rails.application.config.action_mailer.default_url_options[:host]
      URI.join(host, '/settings/billing').to_s
    end
  end
end
