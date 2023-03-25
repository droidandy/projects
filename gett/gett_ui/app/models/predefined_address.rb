using Sequel::CoreRefinements

class PredefinedAddress < Sequel::Model
  plugin :application_model, timestamps: false
  plugin :string_stripper

  many_to_one :airport

  def self.match(str)
    query = str.gsub(/[^\w\d\s]/, '').split.map { |s| "#{s}:*" }.join('&')

    dataset.full_text_search(
      [:additional_terms, :line, :postal_code],
      :to_tsquery.sql_function('simple'.cast(:regconfig), query),
      tsquery: true
    )
  end

  def self.find_exactly(str)
    first(line: str)
  end

  def validate
    super
    validates_presence [:line, :postal_code, :lat, :lng]
    validates_unique(:line)
  end

  def before_create
    super
    self.airport_id ||= Airport.closest(lat, lng)&.id
    self.timezone   ||= Timezones.timezone_at(self)
  end
end

# Table: predefined_addresses
# Columns:
#  id                | integer          | PRIMARY KEY DEFAULT nextval('predefined_addresses_id_seq'::regclass)
#  line              | text             | NOT NULL
#  additional_terms  | text             |
#  postal_code       | text             |
#  lat               | double precision |
#  lng               | double precision |
#  country_code      | text             | NOT NULL DEFAULT 'GB'::text
#  timezone          | text             |
#  city              | text             |
#  airport_id        | integer          |
#  region            | text             |
#  street_name       | text             |
#  street_number     | text             |
#  point_of_interest | text             |
# Indexes:
#  predefined_addresses_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  predefined_addresses_airport_id_fkey | (airport_id) REFERENCES airports(id)
