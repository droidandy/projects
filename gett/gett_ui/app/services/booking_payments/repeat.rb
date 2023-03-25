module BookingPayments
  class Repeat < ApplicationService
    include ApplicationService::ModelMethods
    attributes :booking

    SCHEDULE = [
      1.day,
      5.days,
      10.days,
      15.days
    ].freeze

    def execute!
      return if repeat_in.nil?

      BookingPaymentsWorker.perform_in(repeat_in, booking.id)
      update_model(last_payment, retries: last_payment.retries + 1) if last_payment.present?
    end

    private def repeat_in
      SCHEDULE[last_payment&.retries || 0]
    end

    def last_payment
      return @last_payment if defined?(@last_payment)

      @last_payment = booking.payments_dataset.last
    end
  end
end
