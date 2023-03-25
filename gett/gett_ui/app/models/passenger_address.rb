class PassengerAddress < Sequel::Model
  plugin :application_model
  plugin :association_dependencies
  plugin :audited,
    one_through_one: [
      {
        home_address: {
          target_key: :address_id,
          target_model: Address,
          observed_key: :passenger_id,
          observed_model: Member,
          name: :line,
          only: ->(passenger_address) { passenger_address.type == 'home' }
        }
      },
      {
        work_address: {
          target_key: :address_id,
          target_model: Address,
          observed_key: :passenger_id,
          observed_model: Member,
          name: :line,
          only: ->(passenger_address) { passenger_address.type == 'work' }
        }
      }
    ]

  module AddressType
    HOME = 'home'.freeze
    WORK = 'work'.freeze
    FAVORITE = 'favorite'.freeze
  end

  many_to_one :address
  many_to_one :passenger, class: "Member"

  delegate :home?, :work?, :favorite?, to: :type, allow_nil: true

  dataset_module do
    subset :home, type: 'home'
    subset :work, type: 'work'
    subset :favorite, type: 'favorite'
  end

  def validate
    super
    validates_presence [:address_id, :passenger_id]
    validates_presence :name if favorite?
    validates_unique(:name){ |ds| ds.where(passenger_id: passenger_id, type: type) }
    validates_unique(:address_id){ |ds| ds.favorite.where(passenger_id: passenger_id) } if favorite?
    validates_unique(:address_id){ |ds| ds.where(passenger_id: passenger_id, type: %w(home work)) } if home? || work?
  end

  def type
    super&.inquiry
  end
end

# Table: passenger_addresses
# Columns:
#  id                  | integer                     | PRIMARY KEY DEFAULT nextval('passenger_addresses_id_seq'::regclass)
#  passenger_id        | integer                     | NOT NULL
#  address_id          | integer                     | NOT NULL
#  name                | text                        |
#  type                | address_type                | NOT NULL
#  created_at          | timestamp without time zone | NOT NULL
#  updated_at          | timestamp without time zone | NOT NULL
#  pickup_message      | text                        |
#  destination_message | text                        |
# Indexes:
#  passenger_addresses_pkey                               | PRIMARY KEY btree (id)
#  passenger_addresses_passenger_id_address_id_index      | UNIQUE btree (passenger_id, address_id) WHERE type = ANY (ARRAY['home'::address_type, 'work'::address_type])
#  passenger_addresses_passenger_id_address_id_type_index | UNIQUE btree (passenger_id, address_id, type) WHERE type = 'favorite'::address_type
#  passenger_addresses_passenger_id_type_index            | UNIQUE btree (passenger_id, type) WHERE type = ANY (ARRAY['home'::address_type, 'work'::address_type])
# Foreign key constraints:
#  passenger_addresses_address_id_fkey   | (address_id) REFERENCES addresses(id)
#  passenger_addresses_passenger_id_fkey | (passenger_id) REFERENCES users(id)
