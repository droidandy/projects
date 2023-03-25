using Sequel::CoreRefinements

class Bookings::FormPolicy < ServicePolicy
  allow_all!

  scope(:passengers) do |member|
    base_scope = Passengers::IndexPolicy.scope.call(member)

    next base_scope unless !member.company.bbc? && member.exactly_booker?

    unassigned_passengers = member.company.passengers_dataset
      .left_join(:bookers_passengers, passenger_id: :users[:id])
      .where(:bookers_passengers[:booker_id] => nil)
      .select(:users[:id])

    base_scope.or(:users[:id] =~ unassigned_passengers)
  end

  def select_passenger?
    !member.passenger?
  end

  def change_vehicle_count?
    member.booker? || member.executive?
  end
end
