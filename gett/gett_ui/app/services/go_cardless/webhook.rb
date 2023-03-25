module GoCardless
  class Webhook < ApplicationService
    attributes :events

    def execute!
      events.each(&method(:process_event))
    end

    private def process_event(event)
      case event[:resource_type]
      when 'mandates' then process_mandate_event(event)
      when 'payments' then process_payment_event(event)
      end
    end

    private def process_mandate_event(event)
      mandate = DirectDebitMandate.find(go_cardless_mandate_id: event[:links][:mandate])
      return if mandate.blank?

      ::GoCardless::MandateEventProcessor
        .new(mandate: mandate, event: event)
        .execute
    end

    private def process_payment_event(event)
      payment = DirectDebitPayment.find(go_cardless_payment_id: event[:links][:payment])
      return if payment.blank?

      ::GoCardless::PaymentEventProcessor
        .new(payment: payment, event: event)
        .execute
    end
  end
end
