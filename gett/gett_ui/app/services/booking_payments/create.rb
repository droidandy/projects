module BookingPayments
  class Create < ApplicationService
    include ApplicationService::ModelMethods

    attributes :booking
    delegate :company, :payment_card, to: :booking

    def execute!
      # Don't make payment for periodic payment types
      return if company.with_periodic_payment_type?

      # Don't make payment again if booking already paid or if nothing to pay or there is no payment card
      # NOTE: `booking.billed?` and `booking.successful_payment.present?` is basically a duplication of
      # logic check, but that is made on purpose as additional safe guard if, for some reason, payment
      # status was asynchronously changed without updating booking flag for some reason.
      return if booking.billed? ||
        booking.successful_payment.present? ||
        booking.charges&.total_cost.to_i.zero? ||
        payment_card.blank?

      result { pay_from_card }

      if success?
        update_model(booking, billed: true)
      else
        repeat_payment
      end
    end

    private def pay_from_card
      Payments::Create.new(
        payment_method_token: payment_card.token,
        order_id: order_id,
        statement_soft_descriptor: statement_soft_descriptor,
        payment_params: {
          amount_cents: booking.charges.total_cost,
          description: payment_description,
          booking: booking
        }
      ).execute.success?
    end

    private def order_id
      "booking_#{booking.service_id}"
    end

    private def statement_soft_descriptor
      "OT taxi order: #{booking.id}"
    end

    private def payment_description
      "#{company.name}: #{booking.passenger_name}: #{booking.id}"
    end

    private def repeat_payment
      BookingPayments::Repeat.new(booking: booking).execute
    end
  end
end
