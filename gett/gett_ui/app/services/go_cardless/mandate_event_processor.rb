module GoCardless
  class MandateEventProcessor < ApplicationService
    include ApplicationService::ModelMethods

    attributes :mandate, :event

    def execute!
      case event[:action]
      when 'active', 'reinstated'
        mandate_activated
      when 'failed'
        mandate_failed
      when 'cancelled', 'expired'
        mandate_cancelled
      when 'replaced'
        mandate_replaced
      end
    end

    private def mandate_activated
      update_model(mandate, status: DirectDebitMandate::ACTIVE)
      DirectDebitMailer.direct_debit_set_up(mandate.company_id).deliver_later
    end

    private def mandate_failed
      update_model(mandate, status: DirectDebitMandate::FAILED)
      DirectDebitMailer.direct_debit_failed(mandate.company_id).deliver_later
    end

    private def mandate_cancelled
      update_model(mandate, status: DirectDebitMandate::CANCELLED)
      DirectDebitMailer.direct_debit_cancelled(mandate.company_id).deliver_later
    end

    private def mandate_replaced
      update_model(
        mandate,
        status: DirectDebitMandate::ACTIVE,
        go_cardless_mandate_id: event[:links][:new_mandate]
      )
      DirectDebitMailer.direct_debit_set_up(mandate.company_id).deliver_later
    end
  end
end
