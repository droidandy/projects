class BookingAddress < Sequel::Model
  plugin :application_model
  plugin :audited,
    on: :update,
    one_through_one: [
      {
        pickup_address: {
          target_key: :address_id,
          target_model: Address,
          observed_key: :booking_id,
          observed_model: Booking,
          name: :line,
          only: ->(booking_address) { booking_address.address_type == 'pickup' }
        }
      },
      {
        destination_address: {
          target_key: :address_id,
          target_model: Address,
          observed_key: :booking_id,
          observed_model: Booking,
          name: :line,
          only: ->(booking_address) { booking_address.address_type == 'destination' }
        }
      }
    ]

  many_to_one :address
  many_to_one :booking

  delegate :pickup?, :destination?, :stop?, to: :address_type, allow_nil: true

  def validate
    super
    validates_presence [:address_id, :booking_id, :address_type]
    validates_presence [:stop_info] if address_type == 'stop'
  end

  private def after_create
    super
    booking.refresh_indexes if address_type == 'pickup'
  end

  private def after_update
    super
    booking.refresh_indexes if address_type == 'pickup' && previous_changes&.key?(:address_id)
  end

  def address_type
    super&.inquiry
  end
end

# Table: booking_addresses
# Columns:
#  id                     | integer      | PRIMARY KEY DEFAULT nextval('booking_addresses_id_seq'::regclass)
#  address_id             | integer      | NOT NULL
#  booking_id             | integer      | NOT NULL
#  address_type           | address_type | NOT NULL
#  stop_info              | jsonb        |
#  passenger_address_type | address_type |
# Indexes:
#  booking_addresses_pkey               | PRIMARY KEY btree (id)
#  booking_addresses_address_id_index   | btree (address_id)
#  booking_addresses_address_type_index | btree (address_type)
#  booking_addresses_booking_id_index   | btree (booking_id)
# Foreign key constraints:
#  booking_addresses_address_id_fkey | (address_id) REFERENCES addresses(id)
#  booking_addresses_booking_id_fkey | (booking_id) REFERENCES bookings(id)
