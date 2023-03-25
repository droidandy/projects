class Feedback < Sequel::Model
  plugin :application_model
  many_to_one :booking
  many_to_one :user, class: 'Member'

  def validate
    super
    validates_presence :rating
    validates_includes (1..10).to_a, :rating
  end
end

# Table: feedbacks
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('feedbacks_id_seq'::regclass)
#  booking_id | integer                     | NOT NULL
#  user_id    | integer                     | NOT NULL
#  rating     | integer                     |
#  message    | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  feedbacks_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  feedbacks_booking_id_fkey | (booking_id) REFERENCES bookings(id)
#  feedbacks_user_id_fkey    | (user_id) REFERENCES users(id)
