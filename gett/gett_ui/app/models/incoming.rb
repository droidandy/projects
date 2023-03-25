# TODO: most likely, we don't want to store all incoming requests payload as DB
# records forever, or even at all.
class Incoming < Sequel::Model
  plugin :application_model

  many_to_one :booking
end

# Table: incomings
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('incomings_id_seq'::regclass)
#  booking_id   | integer                     |
#  service_type | service_provider            | NOT NULL
#  payload      | jsonb                       |
#  api_errors   | jsonb                       |
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
# Indexes:
#  incomings_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  incomings_booking_id_fkey | (booking_id) REFERENCES bookings(id)
