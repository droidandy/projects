class BookingMessage < Sequel::Model
  plugin :application_model
  many_to_one :booking
  many_to_one :user

  def validate
    super
    validates_presence :text
  end
end

# Table: booking_messages
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('booking_messages_id_seq'::regclass)
#  booking_id | integer                     | NOT NULL
#  user_id    | integer                     | NOT NULL
#  text       | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  booking_messages_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  booking_messages_booking_id_fkey | (booking_id) REFERENCES bookings(id)
#  booking_messages_user_id_fkey    | (user_id) REFERENCES users(id)
