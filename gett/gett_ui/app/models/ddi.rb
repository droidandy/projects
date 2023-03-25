class Ddi < Sequel::Model
  module Type
    STANDARD = 'standard'.freeze
    KEY      = 'key'.freeze
    MEGA     = 'mega'.freeze
    CUSTOM   = 'custom'.freeze

    PREDEFINED_TYPES = [STANDARD, KEY, MEGA].freeze
    ALL_TYPES = [STANDARD, KEY, MEGA, CUSTOM].freeze
  end

  plugin :application_model

  one_to_many :companies

  def validate
    validates_includes %w{standard key mega custom}, :type
  end

  dataset_module do
    subset(:predefined, type: Type::PREDEFINED_TYPES)
  end

  def self.fetch(type)
    first(type: type&.to_s)
  end

  Type::ALL_TYPES.each do |value|
    define_method("#{value}?") do
      value == type
    end
  end
end

# Table: ddis
# Columns:
#  id    | integer  | PRIMARY KEY DEFAULT nextval('ddis_id_seq'::regclass)
#  type  | ddi_type | NOT NULL
#  phone | text     | NOT NULL
# Indexes:
#  ddis_pkey       | PRIMARY KEY btree (id)
#  ddis_type_index | btree (type)
# Referenced By:
#  companies | companies_ddi_id_fkey | (ddi_id) REFERENCES ddis(id)
