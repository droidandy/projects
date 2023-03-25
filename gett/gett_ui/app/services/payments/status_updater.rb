module Payments
  class StatusUpdater < ApplicationService
    include ApplicationService::ModelMethods

    attributes :payment

    delegate :booking_id, :booking, to: :payment

    def execute!
      get_payment_info_service.execute
      update_payment if get_payment_info_service.success?
    end

    private def get_payment_info_service # rubocop:disable Naming/AccessorMethodName
      @get_payment_info_service ||= PaymentsOS::GetPaymentInfo.new(payment_id: payment.payments_os_id, expand: 'all')
    end

    private def update_payment
      payment_info_data = get_payment_info_service.response.data
      status = payment_info_data['status']

      if status == 'Initialized' && payment_info_data.dig('related_resources', 'charges').present?
        last_charge = payment_info_data['related_resources']['charges'].max_by{ |i| i['created_at'].to_i }

        save_model(payment,
          status: 'failed',
          error_description: last_charge['result'].map{ |k, v| "#{k}: #{v}" }.join('; ')
        )
        repeat_payment if booking_id.present?
      else
        return if payment.successful?

        transaction do
          result { save_model(payment, status: status.downcase) }

          if payment.successful?
            send_receipt
            mark_invoices_paid
            update_model(booking, billed: true) if booking_id.present?
          elsif payment.booking_id.present?
            repeat_payment
          end
        end
      end
    end

    private def mark_invoices_paid
      payment.invoices.each(&:mark_as_paid!)
    end

    private def send_receipt
      if payment.booking_id.present?
        CardReceiptMailer.card_receipt(payment.booking).deliver_later
        return
      end

      payment.invoices.each do |invoice|
        Invoices::Receipt.new(invoice: invoice).execute
      end
    end

    private def repeat_payment
      BookingPayments::Repeat.new(booking: payment.booking).execute
    end
  end
end
