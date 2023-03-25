module Admin::Bookings
  class Show < Shared::Bookings::Show
    def execute!
      super.deep_merge(
        company_name: booking.company.name,
        company_id: booking.company.id,
        passenger_id: booking.passenger_id,
        booker_id: booking.booker_id,
        comments_count: booking.comments_dataset.count,
        charges: charges,
        customer_care_message: booking.customer_care_message,
        back_office_booker: !booking.booker.member?,
        customer_care_at: booking.customer_care_at,
        status_before_cancellation: booking.status_before_cancellation,
        payment_details: payment_details,
        critical_flag: booking.critical_flag,
        critical_flag_enabled_at: booking.critical_flag_enabled_at,
        critical_flag_enabled_by: booking.critical_flag_enabled_by,
        labels: booking.flags,
        can: {
          create_message: true,
          edit: booking.editable_in_back_office?,
          see_pricing: can_see_pricing?,
          see_logs: true
        }
      )
    end

    private def can_see_pricing?
      booking.manual? || booking.final? || booking.customer_care?
    end

    private def charges
      booking.charges&.as_json(except: %i(id booking_id created_at updated_at))
    end

    private def payment_details
      booking.payments.last.as_json(only: %i(payments_os_id zooz_request_id error_description))
    end
  end
end
