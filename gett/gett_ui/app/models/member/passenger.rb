using Sequel::CoreRefinements

module Member::Passenger
  extend ActiveSupport::Concern

  included do
    many_to_many :bookers, left_key: :passenger_id, right_key: :booker_id,
      join_table: :bookers_passengers, delay_pks: :always, class: self

    one_to_many :bookings, key: :passenger_id
    one_to_many :passenger_addresses, key: :passenger_id
    one_through_one :home_address,
      class:      'Address',
      select:     [:addresses.*, 'home'.as(:passenger_address_type)],
      join_table: :passenger_addresses,
      left_key:   :passenger_id,
      right_key:  :address_id do |ds|

      ds.where(:passenger_addresses[:type] => 'home')
    end
    one_through_one :work_address,
      class:      'Address',
      join_table: :passenger_addresses,
      left_key:   :passenger_id,
      right_key:  :address_id do |ds|

      ds.where(:passenger_addresses[:type] => 'work')
    end
    one_to_many :favorite_addresses,
      class:      'PassengerAddress',
      key:        :passenger_id,
      conditions: {type: 'favorite'}

    one_to_many :all_payment_cards, class: 'PaymentCard', key: :passenger_id
    one_to_many :payment_cards, key: :passenger_id, conditions: {active: true}

    add_association_dependencies(
      passenger_addresses: :destroy,
      all_payment_cards: :destroy,
      bookers: :nullify
    )

    alias_method :wheelchair_user?, :wheelchair_user

    dataset_module do
      subset(:yet_to_invite) { {active: true, last_logged_in_at: nil} & ~{onboarding: true} }
    end
  end

  def validate
    super

    # no bookers can be assigned on import, omit extra SQL calls
    return if import

    if roles_by_member_pks(booker_pks).include?('passenger')
      errors.add(:booker_pks, I18n.t('booker.errors.booker_pks_invalid'))
    end
  end

  def home_passenger_address
    passenger_addresses.find(&:home?)
  end

  def work_passenger_address
    passenger_addresses.find(&:work?)
  end

  def build_passenger_address(params)
    PassengerAddress.new(params.merge(passenger_id: id))
  end

  # TODO: check if there is a Sequel way (via options or plugins) to fetch ids from
  # loaded association instead of SQL request if possible
  def booker_pks
    return bookers.map(&:id) if associations.key?(:bookers)

    super
  end

  def passenger_of?(booker)
    booker_pks.include?(booker.id)
  end
end
