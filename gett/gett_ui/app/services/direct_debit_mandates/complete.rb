require 'go_cardless_client_builder'

module DirectDebitMandates
  class Complete < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    delegate :company, :member, to: :context
    attributes :redirect_flow_id

    def self.policy_class
      DirectDebitMandates::Policy
    end

    def execute!
      return if mandate.nil? ||
        mandate.created_by_id != member.id ||
        mandate.go_cardless_redirect_flow_id != redirect_flow_id

      redirect_flow = client.redirect_flows.complete(redirect_flow_id, params: { session_token: member.id.to_s })

      result do
        update_model(
          mandate,
          go_cardless_mandate_id: redirect_flow.links.mandate,
          status: DirectDebitMandate::PENDING
        )
      end
    end

    private def mandate
      @mandate ||= company.direct_debit_mandate
    end

    private def client
      @client ||= GoCardlessClientBuilder.build
    end
  end
end
