require 'postgis'

class PricingRule < Sequel::Model
  plugin :application_model
  plugin :association_dependencies

  many_to_one :company
  many_to_one :pickup_address, class: 'Address'
  many_to_one :destination_address, class: 'Address'

  dataset_module do
    scope(:active) { where(active: true) }
  end

  def before_save
    super
    clear_non_area_attributes if rule_type&.area?
  end

  def validate
    super
    validates_presence(%i(
      company name vehicle_types rule_type price_type booking_type time_frame
    ))

    if rule_type&.point_to_point?
      validates_presence(%i(pickup_point destination_point))
    end

    if rule_type&.area?
      validates_includes(['meter'], :price_type)
      validates_presence(:pickup_polygon)
    end

    if price_type&.fixed?
      validates_presence(:base_fare)
    end

    if price_type&.meter?
      validates_presence(%i(initial_cost after_distance after_cost))
    end

    if time_frame&.daily?
      validates_presence(%i(min_time max_time))
    end

    if time_frame&.custom?
      validates_presence(%i(starting_at ending_at))
    end
  end

  def rule_type
    super&.inquiry
  end

  def price_type
    super&.inquiry
  end

  def time_frame
    super&.inquiry
  end

  def pickup_point=(point)
    super(Postgis.point_to_sql(point))
  end

  def pickup_polygon
    Postgis.sql_to_polygon(values[:pickup_polygon_text]) || values[:pickup_polygon]
  end

  def pickup_polygon=(points)
    super(Postgis.polygon_to_sql(points))
  end

  def destination_point=(point)
    super(Postgis.point_to_sql(point))
  end

  def destination_polygon
    Postgis.sql_to_polygon(values[:destination_polygon_text]) || values[:destination_polygon]
  end

  def destination_polygon=(points)
    super(Postgis.polygon_to_sql(points))
  end

  private def clear_non_area_attributes
    self.pickup_point = nil
    self.destination_point = nil
    self.pickup_address = nil
    self.destination_address = nil
    self.destination_polygon = nil
  end
end

# Table: pricing_rules
# Columns:
#  id                     | integer                     | PRIMARY KEY DEFAULT nextval('pricing_rules_id_seq'::regclass)
#  company_id             | integer                     |
#  name                   | text                        | NOT NULL
#  vehicle_types          | text[]                      | NOT NULL DEFAULT '{}'::text[]
#  active                 | boolean                     | NOT NULL DEFAULT true
#  rule_type              | pr_rule_type                | NOT NULL
#  price_type             | pr_price_type               | NOT NULL
#  pickup_address_id      | integer                     |
#  destination_address_id | integer                     |
#  pickup_polygon         | geography(Polygon,4326)     |
#  destination_polygon    | geography(Polygon,4326)     |
#  pickup_point           | geography(Point,4326)       |
#  destination_point      | geography(Point,4326)       |
#  base_fare              | double precision            |
#  initial_cost           | double precision            |
#  after_distance         | double precision            |
#  after_cost             | double precision            |
#  created_at             | timestamp without time zone | NOT NULL
#  updated_at             | timestamp without time zone | NOT NULL
#  booking_type           | pr_booking_type             | NOT NULL DEFAULT 'both'::pr_booking_type
#  min_time               | time without time zone      | DEFAULT '00:00:00'::time without time zone
#  max_time               | time without time zone      | DEFAULT '23:59:59'::time without time zone
#  time_frame             | pr_time_frame               | NOT NULL DEFAULT 'daily'::pr_time_frame
#  starting_at            | timestamp without time zone |
#  ending_at              | timestamp without time zone |
# Indexes:
#  pricing_rules_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  pricing_rules_company_id_fkey             | (company_id) REFERENCES companies(id)
#  pricing_rules_destination_address_id_fkey | (destination_address_id) REFERENCES addresses(id)
#  pricing_rules_pickup_address_id_fkey      | (pickup_address_id) REFERENCES addresses(id)
