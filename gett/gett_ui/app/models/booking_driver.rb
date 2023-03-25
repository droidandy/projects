require 'waypoint'

class BookingDriver < Sequel::Model
  FEET_IN_MILE = 5280
  RATING_REASONS = %w(
    driver_professionalism
    vehicle_condition
    driving_style
    car_model
    pickup
    route
    app
    traffic
  ).freeze

  plugin :application_model
  plugin :audited,
    values: [
      :name, :rating, :phone_number
    ]

  many_to_one :booking

  def validate
    super
    validate_rating_reasons if rating_reasons.present?
  end

  def info_is_blank?
    [name, vehicle, phone_number].all?(&:blank?)
  end

  private def after_save
    super
    booking.refresh_indexes if booking.ot?
  end

  def vehicle
    Hashie::Mash.new(super)
  end

  def location
    return unless lat.present? && lng.present?

    {lat: lat, lng: lng}
  end

  def distance_details
    return unless distance.to_i > 0

    if distance >= 1000
      {value: (distance.to_f / FEET_IN_MILE).round(1), unit: 'miles'}
    else
      {value: distance, unit: 'feet'}
    end
  end

  def pickup_distance_mi
    pickup_distance.to_f / FEET_IN_MILE if pickup_distance.present?
  end

  def path_points
    super&.map{ |point| Waypoint.new(point) }
  end

  def in_progress_path_points
    path_points&.select(&:in_progress?)&.map(&:coordinates)
  end

  private def validate_rating_reasons
    unless rating_reasons.all?{ |reason| RATING_REASONS.include?(reason) }
      errors.add(:rating_reasons, I18n.t('booking_driver.errors.invalid_rating_reasons'))
    end
  end
end

# Table: booking_drivers
# Columns:
#  id                  | integer                     | PRIMARY KEY DEFAULT nextval('booking_drivers_id_seq'::regclass)
#  booking_id          | integer                     | NOT NULL
#  name                | text                        |
#  rating              | double precision            |
#  image_url           | text                        |
#  phone_number        | text                        |
#  lat                 | double precision            |
#  lng                 | double precision            |
#  eta                 | integer                     |
#  distance            | integer                     |
#  will_arrive_at      | timestamp without time zone |
#  pickup_lat          | double precision            |
#  pickup_lng          | double precision            |
#  vehicle             | hstore                      |
#  path_points         | jsonb                       |
#  created_at          | timestamp without time zone | NOT NULL
#  updated_at          | timestamp without time zone | NOT NULL
#  pickup_distance     | double precision            |
#  trip_rating         | integer                     |
#  location_updated_at | timestamp without time zone |
#  vendor_name         | text                        |
#  bearing             | integer                     |
#  rating_reasons      | text[]                      | NOT NULL DEFAULT ARRAY[]::text[]
# Indexes:
#  booking_drivers_pkey             | PRIMARY KEY btree (id)
#  booking_drivers_booking_id_index | UNIQUE btree (booking_id)
# Foreign key constraints:
#  booking_drivers_booking_id_fkey | (booking_id) REFERENCES bookings(id)
