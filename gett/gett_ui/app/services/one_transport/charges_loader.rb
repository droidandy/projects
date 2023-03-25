module OneTransport
  class ChargesLoader < ApplicationService
    include ApplicationService::ModelMethods

    LOAD_INTERVAL = ->{ 1.week.ago.beginning_of_week..1.week.ago.end_of_week }

    def execute!
      return if Settings.ot_charges_db.database.blank?

      billable_booking_records.each do |booking_record|
        booking = Booking.find(service_id: booking_record[:ext_conf_no].strip)
        fare_quote =
          booking
            .company
            .price_with_fx_rate_increase(
              fetch_vatable_column(:bill_journey_cost, booking_record) * 100,
              international: booking.international?)

        update_model(
          booking,
          ot_waiting_time: booking_record[:waiting_time].to_i.minutes,
          travel_distance: booking_record[:mileage_driven],
          fare_quote: fare_quote,
          ot_extra_cost: (fetch_vatable_column(:bill_misc_cost, booking_record) * 100).round
        )
        recalculate_charges(booking)
      end

      log_error if not_calculated_bookings.any?
    end

    private def billable_booking_records
      with_ot_database do |db|
        db[:v_v3_customer_price].where(ext_conf_no: billable_bookings.pluck(:service_id)).all
      end
    end

    private def billable_bookings
      Booking.ot.periodic_payments.billable.not_manually_charged.where do
        (cancelled_at =~ LOAD_INTERVAL.call) |
        ((cancelled_at =~ nil) & (scheduled_at =~ LOAD_INTERVAL.call))
      end
    end

    private def not_calculated_bookings
      billable_bookings.completed.where(ot_waiting_time: nil)
    end

    private def recalculate_charges(booking)
      BookingsChargesUpdater.perform_async(booking.id)
    end

    private def log_error
      service_ids = not_calculated_bookings.pluck(:service_id).join(', ')
      message = "Waiting time wasn't calculated for completed OT bookings with next service IDs: #{service_ids}"

      Rails.logger.error(message)
      Airbrake.notify(message)
    end

    private def with_ot_database
      Sequel.connect(Settings.ot_charges_db.to_h){ |db| yield db }
    end

    private def fetch_vatable_column(column, booking_record)
      vatable_value = booking_record["#{column}_vatable".to_sym]
      (vatable_value == 0) ? booking_record[column.to_sym] : vatable_value
    end
  end
end
