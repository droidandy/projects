class BookingCharges < Sequel::Model
  plugin :application_model
  plugin :audited,
    on: :update,
    values: [
      :total_cost, :fare_cost, :handling_fee, :booking_fee, :tips,
      :paid_waitin_time_fee, :phone_booking_fee, :run_in_fee,
      :stops_fee, :extra1, :extra2, :extra3, :additional_fee
    ]

  many_to_one :booking

  def all_costs
    service_specific_costs = booking.ot? ? extra1 : 0

    fare_cost + service_specific_costs
  end

  def all_fees
    service_specific_fees =
      if booking.gett?
        stops_fee + additional_fee + extra1 + extra2 + extra3
      else
        0
      end

    paid_waiting_time_fee + handling_fee + booking_fee + cancellation_fee +
      run_in_fee + phone_booking_fee + tips + service_specific_fees +
      international_booking_fee
  end

  def paid_waiting_time_minutes
    (paid_waiting_time.to_i / 1.minute).round
  end
end

# Table: booking_charges
# Columns:
#  id                        | integer                     | PRIMARY KEY DEFAULT nextval('booking_charges_id_seq'::regclass)
#  booking_id                | integer                     | NOT NULL
#  fare_cost                 | integer                     | NOT NULL DEFAULT 0
#  handling_fee              | integer                     | NOT NULL DEFAULT 0
#  booking_fee               | integer                     | NOT NULL DEFAULT 0
#  paid_waiting_time_fee     | integer                     | NOT NULL DEFAULT 0
#  stops_text                | text                        |
#  stops_fee                 | integer                     | NOT NULL DEFAULT 0
#  phone_booking_fee         | integer                     | NOT NULL DEFAULT 0
#  tips                      | integer                     | NOT NULL DEFAULT 0
#  vat                       | integer                     | NOT NULL DEFAULT 0
#  total_cost                | integer                     | NOT NULL DEFAULT 0
#  created_at                | timestamp without time zone | NOT NULL
#  updated_at                | timestamp without time zone | NOT NULL
#  cancellation_fee          | integer                     | NOT NULL DEFAULT 0
#  run_in_fee                | integer                     | NOT NULL DEFAULT 0
#  additional_fee            | integer                     | NOT NULL DEFAULT 0
#  extra1                    | integer                     | NOT NULL DEFAULT 0
#  extra2                    | integer                     | NOT NULL DEFAULT 0
#  extra3                    | integer                     | NOT NULL DEFAULT 0
#  free_waiting_time         | integer                     | DEFAULT 0
#  paid_waiting_time         | integer                     | DEFAULT 0
#  international_booking_fee | integer                     | NOT NULL DEFAULT 0
#  vatable_ride_fees         | integer                     | NOT NULL DEFAULT 0
#  non_vatable_ride_fees     | integer                     | NOT NULL DEFAULT 0
#  service_fees              | integer                     | NOT NULL DEFAULT 0
#  vatable_extra_fees        | integer                     | NOT NULL DEFAULT 0
#  non_vatable_extra_fees    | integer                     | NOT NULL DEFAULT 0
#  manual                    | boolean                     | NOT NULL DEFAULT false
# Indexes:
#  booking_charges_pkey             | PRIMARY KEY btree (id)
#  booking_charges_booking_id_index | btree (booking_id)
# Foreign key constraints:
#  booking_charges_booking_id_fkey | (booking_id) REFERENCES bookings(id)
