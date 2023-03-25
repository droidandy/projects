class CompanyInfo < Sequel::Model
  CANCELLATION_FEE_OPTIONS = [0, 25, 50, 75, 100].freeze

  plugin :application_model

  plugin :audited,
    values: [
      :name, :vat_number, :cost_centre, :legal_name, :booking_fee,
      :handling_fee, :phone_booking_fee, :run_in_fee,
      :international_booking_fee, :tips, logo: :filename
    ],
    many_to_one: [
      { address: { name: :line } },
      { legal_address: { key: :legal_address_id, name: :line, class: Address } },
      { salesman: { name: :full_name, class: User } }
    ]

  many_to_one :company
  many_to_one :salesman, class: 'User'
  many_to_one :account_manager, class: 'User'
  many_to_one :address
  many_to_one :legal_address, class: 'Address'

  # Since `orders` view contains information about primary company contact that
  # was actual at the moment of booking creation, company_info records also
  # store id of such contact
  many_to_one :contact
  one_to_many :bookings

  def validate
    super
    validates_presence(%i(
      name international_booking_fee
      quote_price_increase_percentage quote_price_increase_pounds
      system_fx_rate_increase_percentage
    ))
    validates_name(:name)
    validates_unique(:name){ |ds| ds.where(active: true) }
    validates_includes(CANCELLATION_FEE_OPTIONS, :cancellation_before_arrival_fee)
    validates_includes(CANCELLATION_FEE_OPTIONS, :cancellation_after_arrival_fee)
    validates_operator(:>=, 0, %i(
      gett_cancellation_before_arrival_fee gett_cancellation_after_arrival_fee phone_booking_fee
    ))
    validates_operator(:>=, 0, %i(
      booking_fee handling_fee run_in_fee tips international_booking_fee
      quote_price_increase_percentage quote_price_increase_pounds
      system_fx_rate_increase_percentage
    ), allow_nil: true)
    validates_includes(CANCELLATION_FEE_OPTIONS, :get_e_cancellation_before_arrival_fee)
    validates_includes(CANCELLATION_FEE_OPTIONS, :get_e_cancellation_after_arrival_fee)
    validates_includes(CANCELLATION_FEE_OPTIONS, :splyt_cancellation_before_arrival_fee)
    validates_includes(CANCELLATION_FEE_OPTIONS, :splyt_cancellation_after_arrival_fee)
    validates_includes(CANCELLATION_FEE_OPTIONS, :carey_cancellation_before_arrival_fee)
    validates_includes(CANCELLATION_FEE_OPTIONS, :carey_cancellation_after_arrival_fee)
    validates_includes(ISO3166::Country.all.map(&:alpha2), :country_code)
  end

  private def before_create
    super
    self.contact_id = company&.primary_contact&.id
  end

  def used?
    persisted? && bookings_dataset.any?
  end

  def superseded_clone
    CompanyInfo.new(values.except(:id, :active, :contact_id, :created_at, :updated_at))
  end
end

# Table: company_infos
# Columns:
#  id                                    | integer                     | PRIMARY KEY DEFAULT nextval('company_infos_id_seq'::regclass)
#  company_id                            | integer                     |
#  name                                  | text                        | NOT NULL
#  legal_name                            | text                        |
#  vat_number                            | text                        |
#  cost_centre                           | text                        |
#  address_id                            | integer                     |
#  legal_address_id                      | integer                     |
#  salesman_id                           | integer                     |
#  contact_id                            | integer                     |
#  booking_fee                           | double precision            |
#  run_in_fee                            | double precision            |
#  handling_fee                          | double precision            |
#  active                                | boolean                     | NOT NULL DEFAULT true
#  created_at                            | timestamp without time zone | NOT NULL
#  updated_at                            | timestamp without time zone | NOT NULL
#  account_number                        | text                        |
#  sort_code                             | text                        |
#  phone_booking_fee                     | double precision            | NOT NULL DEFAULT 1.0
#  tips                                  | double precision            |
#  cancellation_before_arrival_fee       | integer                     | NOT NULL DEFAULT 0
#  cancellation_after_arrival_fee        | integer                     | NOT NULL DEFAULT 0
#  gett_cancellation_before_arrival_fee  | double precision            | NOT NULL DEFAULT 0
#  gett_cancellation_after_arrival_fee   | double precision            | NOT NULL DEFAULT 0
#  account_manager_id                    | integer                     |
#  get_e_cancellation_before_arrival_fee | integer                     | NOT NULL DEFAULT 0
#  get_e_cancellation_after_arrival_fee  | integer                     | NOT NULL DEFAULT 0
#  international_booking_fee             | double precision            | NOT NULL DEFAULT 0
#  system_fx_rate_increase_percentage    | double precision            | NOT NULL DEFAULT 0
#  quote_price_increase_percentage       | double precision            | NOT NULL DEFAULT 0
#  quote_price_increase_pounds           | double precision            | NOT NULL DEFAULT 0
#  splyt_cancellation_before_arrival_fee | integer                     | NOT NULL DEFAULT 0
#  splyt_cancellation_after_arrival_fee  | integer                     | NOT NULL DEFAULT 0
#  country_code                          | text                        |
#  carey_cancellation_before_arrival_fee | integer                     | NOT NULL DEFAULT 0
#  carey_cancellation_after_arrival_fee  | integer                     | NOT NULL DEFAULT 0
# Indexes:
#  company_infos_pkey                     | PRIMARY KEY btree (id)
#  company_infos_account_manager_id_index | btree (account_manager_id)
#  company_infos_address_id_index         | btree (address_id)
#  company_infos_company_id_index         | btree (company_id)
#  company_infos_contact_id_index         | btree (contact_id)
#  company_infos_country_code_index       | btree (country_code)
#  company_infos_legal_address_id_index   | btree (legal_address_id)
#  company_infos_name_index               | gin (name gin_trgm_ops)
#  company_infos_salesman_id_index        | btree (salesman_id)
# Foreign key constraints:
#  company_infos_account_manager_id_fkey | (account_manager_id) REFERENCES users(id)
#  company_infos_address_id_fkey         | (address_id) REFERENCES addresses(id)
#  company_infos_company_id_fkey         | (company_id) REFERENCES companies(id)
#  company_infos_contact_id_fkey         | (contact_id) REFERENCES contacts(id)
#  company_infos_legal_address_id_fkey   | (legal_address_id) REFERENCES addresses(id)
#  company_infos_salesman_id_fkey        | (salesman_id) REFERENCES users(id)
# Referenced By:
#  bookings | bookings_company_info_id_fkey | (company_info_id) REFERENCES company_infos(id)
