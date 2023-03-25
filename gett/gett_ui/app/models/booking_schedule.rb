class BookingSchedule < Sequel::Model
  plugin :application_model
  plugin :boolean_readers

  one_to_many :bookings, key: :schedule_id

  def validate
    super
    validates_presence(:scheduled_ats)
  end

  def weekdays=(value)
    if value.is_a?(Array)
      super(value.map{ |d| 1 << d.to_i - 1 }.reduce(&:|) || 0)
    else
      super
    end
  end

  def weekdays
    value = super
    (1..7).map{ |i| i.to_s if value & (1 << i - 1) > 0 }.compact
  end
end

# Table: booking_schedules
# Columns:
#  id                | integer                       | PRIMARY KEY DEFAULT nextval('booking_schedules_id_seq'::regclass)
#  custom            | boolean                       | NOT NULL DEFAULT false
#  preset_type       | recurrence_preset_type        |
#  recurrence_factor | integer                       |
#  starting_at       | timestamp without time zone   |
#  ending_at         | timestamp without time zone   |
#  workdays_only     | boolean                       |
#  weekdays          | integer                       | NOT NULL DEFAULT 0
#  scheduled_ats     | timestamp without time zone[] | DEFAULT '{}'::timestamp without time zone[]
#  created_at        | timestamp without time zone   | NOT NULL
#  updated_at        | timestamp without time zone   | NOT NULL
# Indexes:
#  booking_schedules_pkey | PRIMARY KEY btree (id)
# Referenced By:
#  bookings | bookings_schedule_id_fkey | (schedule_id) REFERENCES booking_schedules(id)
