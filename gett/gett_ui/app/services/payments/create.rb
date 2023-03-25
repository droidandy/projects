module Payments
  class Create < ApplicationService
    include ApplicationService::ModelMethods

    attributes :payment_method_token, :order_id, :statement_soft_descriptor, :payment_params

    CURRENCY = 'GBP'.freeze

    delegate :amount_cents, :description, to: :payment

    def execute!(&block)
      if payment.persisted?
        process_existing_payment
      else
        create_payments_os_payment
      end
      assert { authorize_payments_os_payment } if success?
      assert { capture_payments_os_payment(&block) } if success?
    end

    private def process_existing_payment
      return fail! if payment.successful?

      result { update_model(payment, status: 'initialized') }
    end

    private def create_payments_os_payment
      service = PaymentsOS::CreatePayment.new(
        amount: amount_cents.to_f / 100,
        currency: CURRENCY,
        statement_soft_descriptor: statement_soft_descriptor,
        additional_details: { description: description },
        order: { id: order_id }
      ).execute

      return fail_creation!(service.data.inspect) unless service.success?

      payment_id = service.data['id']
      result do
        create_model(
          payment,
          payments_os_id: payment_id,
          zooz_request_id: service.headers[:x_zooz_request_id]
        )
      end
    rescue StandardError => err
      fail_creation!(err.message)
    end

    private def fail_creation!(message)
      Rails.logger.error(message)
      Airbrake.notify(message)
      fail!
    end

    private def fail_payment!(message)
      update_model(payment, status: 'failed', error_description: message)
      fail!
    end

    private def authorize_payments_os_payment
      service = PaymentsOS::AuthorizePayment.new(
        payment_id: payment.payments_os_id,
        payment_method_token: payment_method_token,
        reconciliation_id: order_id
      ).execute

      update_model(payment, zooz_request_id: service.headers[:x_zooz_request_id])
      service.success? || fail_payment!(service.data.inspect)
    end

    private def capture_payments_os_payment
      service = PaymentsOS::CapturePayment.new(
        payment_id: payment.payments_os_id,
        reconciliation_id: order_id
      ).execute

      return fail_payment!(service.data['result'].inspect) unless service.success?

      transaction do
        update_payment_status(service)
        yield payment if block_given?
      end

      success?
    end

    private def update_payment_status(service)
      status = service.data['result']['status']

      update_model(payment, zooz_request_id: service.headers[:x_zooz_request_id])

      return fail_payment!(service.data['result'].inspect) if status == 'Failed'

      assert { update_model(payment, status: (status == 'Succeed') ? 'captured' : 'pending') }
    end

    private def payment
      @payment ||= find_existing_payment ||
        Payment.new(**payment_params, currency: CURRENCY, status: 'initialized')
    end

    private def find_existing_payment
      fingerprint = Payment.generate_fingerprint(
        payment_params.merge(booking_id: payment_params[:booking]&.id)
      )
      Payment.find(fingerprint: fingerprint)
    end
  end
end
