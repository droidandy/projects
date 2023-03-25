module Admin::Bookings
  class Row < ::Bookings::Row
    attributes :with_charges

    def execute!
      super.merge(
        company_name: booking.company.name,
        company_id: booking.company.id,
        passenger_id: booking.passenger_id,
        labels: booking.flags,
        vendor_name: booking.vendor_name
      ).tap do |json|
        json[:charges] = charges if with_charges
      end
    end

    private def charges
      booking.charges&.as_json(except: %i(id booking_id created_at updated_at))
    end
  end
end
