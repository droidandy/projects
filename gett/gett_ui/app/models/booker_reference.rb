class BookerReference < Sequel::Model
  plugin :application_model

  many_to_one :booking

  # :index is used during booking creation to track position on form.
  # :booking_reference is used for validation means, and to persist booking
  # reference name on record creation. there's no foreign key since booking_reference
  # record may be deleted or updated in any way, and all we need here is its name
  # at the moment of booker_reference record creation
  attr_accessor :index, :booking_reference

  def before_validation
    super
    self.booking_reference_name ||= booking_reference&.name
  end

  def valid?(opts = {})
    @validate_only_value = opts.delete(:only_value)
    super
  ensure
    remove_instance_variable('@validate_only_value')
  end

  def validate
    super
    validates_presence([:booking_reference_name, :value])
    validate_value
    unless @validate_only_value
      validates_presence(:booking_id)
      validates_unique([:booking_id, :booking_reference_name])
    end
  end

  private def validate_value
    return if booking_reference.nil? || value.blank? || !booking_reference.validation_required?

    if booking_reference.reference_entries_dataset.where(value: value).blank?
      errors.add(:value, I18n.t('booker_reference.errors.reference_value_invalid'))
    end
  end
end

# Table: booker_references
# Columns:
#  id                     | integer                     | PRIMARY KEY DEFAULT nextval('booker_references_id_seq'::regclass)
#  booking_id             | integer                     | NOT NULL
#  value                  | text                        | NOT NULL
#  created_at             | timestamp without time zone | NOT NULL
#  updated_at             | timestamp without time zone | NOT NULL
#  booking_reference_name | text                        | NOT NULL
# Indexes:
#  booker_references_pkey                         | PRIMARY KEY btree (id)
#  booker_references_booking_reference_name_index | btree (booking_reference_name)
# Foreign key constraints:
#  booker_references_booking_id_fkey | (booking_id) REFERENCES bookings(id)
