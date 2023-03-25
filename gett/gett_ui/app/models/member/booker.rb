module Member::Booker
  extend ActiveSupport::Concern

  included do
    many_to_many :passengers, left_key: :booker_id, right_key: :passenger_id,
      join_table: :bookers_passengers, delay_pks: :always, class: self

    add_association_dependencies(
      passengers: :nullify
    )
  end

  # TODO: check if there is a Sequel way (via options or plugins) to fetch ids from
  # loaded association instead of SQL request if possible
  def passenger_pks
    return passengers.map(&:id) if associations.key?(:passengers)

    super
  end

  def raw_passengers_dataset
    DB[:members]
      .left_join(:bookers_passengers, passenger_id: :id)
      .where(booker_id: id)
  end

  def booker_of?(passenger)
    passenger_pks.include?(passenger.id)
  end
end
