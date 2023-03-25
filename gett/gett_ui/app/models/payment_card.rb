class PaymentCard < Sequel::Model
  plugin :application_model
  plugin :string_stripper
  plugin :boolean_readers

  many_to_one :passenger, class: 'Member'
  many_to_one :company
  one_to_many :bookings

  attr_accessor :card_number, :cvv

  def validate
    super
    if token.blank?
      validates_presence [:card_number, :cvv]
      validates_format /\A\d{8}|\d{12,19}\z/, :card_number
      validates_format /\A\d{3,4}\z/, :cvv
    end
    validates_presence :token if card_number.blank?
    validates_presence [:last_4, :holder_name, :expiration_month, :expiration_year]
    validates_presence :passenger_id if company_id.blank?
    validates_presence :company_id if passenger_id.blank?
  end

  def before_validation
    super
    return if card_number.blank?

    self.last_4 = card_number.to_s.gsub(/\s/, '')[-4..-1]
  end

  def type
    personal? ? 'personal' : 'business'
  end

  def kind
    type.titleize
  end

  def business?
    passenger_id.present? && !personal?
  end

  def title
    "#{kind} payment card ending with #{last_4}"
  end

  def deactivate!
    update(active: false)
  end

  def make_default!
    update(default: true)
  end

  def expired?
    year = expiration_year.to_s.rjust(4, Time.current.year.to_s).to_i
    year < Time.current.year || (year == Time.current.year && expiration_month < Time.current.month)
  end
  alias expired expired?
end

# Table: payment_cards
# Columns:
#  id               | integer                     | PRIMARY KEY DEFAULT nextval('payment_cards_id_seq'::regclass)
#  passenger_id     | integer                     |
#  holder_name      | text                        | NOT NULL
#  last_4           | text                        | NOT NULL
#  expiration_month | integer                     | NOT NULL
#  expiration_year  | integer                     | NOT NULL
#  active           | boolean                     | NOT NULL DEFAULT true
#  token            | text                        |
#  created_at       | timestamp without time zone | NOT NULL
#  updated_at       | timestamp without time zone | NOT NULL
#  personal         | boolean                     | NOT NULL DEFAULT true
#  company_id       | integer                     |
#  default          | boolean                     | NOT NULL DEFAULT false
# Indexes:
#  payment_cards_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  payment_cards_company_id_fkey   | (company_id) REFERENCES companies(id)
#  payment_cards_passenger_id_fkey | (passenger_id) REFERENCES users(id)
# Referenced By:
#  bookings | bookings_payment_card_id_fkey | (payment_card_id) REFERENCES payment_cards(id)
