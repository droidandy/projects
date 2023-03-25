using Sequel::CoreRefinements

class Bookers::FormPolicy < ServicePolicy
  scope :passengers do |member|
    dataset = member.company.passengers_dataset.active

    if member.executive?
      dataset
    else
      dataset.left_outer_join(:bookers_passengers, passenger_id: :users[:id])
        .where(Sequel.|(
          { :users[:id] => member.passengers_dataset.select(:users[:id]) },
          { :bookers_passengers[:passenger_id] => nil }
        ))
    end
  end

  delegate :booker, to: :service
  delegate :company, to: :member

  def execute?
    !member.passenger?
  end

  def edit_all?
    member.company.enterprise?
  end

  def change_role?
    member.executive?
  end

  def change_active?
    member.executive? && member.id != booker&.id
  end

  def see_log?
    return false if company.bbc?

    member.executive? || (member.booker? && member.pk == booker.pk)
  end

  def assign_passengers?
    !member.passenger?
  end

  alias change_department? change_role?
  alias change_email? change_role?
  alias change_work_role? change_role?
end
