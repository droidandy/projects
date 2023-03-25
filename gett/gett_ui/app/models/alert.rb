class Alert < Sequel::Model
  plugin :application_model

  dataset_module do
    subset :pending, resolved: false
    subset :has_no_driver, type: 'has_no_driver'
    subset :critical, level: 'critical'
    subset :medium, level: 'medium'
  end

  many_to_one :booking

  def validate
    super
    validates_presence [:type, :level, :booking]
  end

  def level
    super&.inquiry
  end

  def type
    super&.inquiry
  end

  delegate :critical?, :medium?, :normal?, to: :level, allow_nil: true
end

# Table: alerts
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('alerts_id_seq'::regclass)
#  booking_id | integer                     | NOT NULL
#  type       | alert_type                  | NOT NULL
#  level      | alert_level                 | NOT NULL
#  message    | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
#  resolved   | boolean                     | NOT NULL DEFAULT false
# Indexes:
#  alerts_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  alerts_booking_id_fkey | (booking_id) REFERENCES bookings(id)
