using Sequel::CoreRefinements

class Bookers::IndexPolicy < ServicePolicy
  scope do |member|
    dataset = member.company.bookers_dataset.select_all(:users)

    if member.company.bbc? || member.executive?
      dataset
    elsif member.passenger?
      # passenger is allowed to indirectly see list of bookers related with her
      # on PassengerForm
      dataset.where(:users[:id] => member.bookers_dataset.select(:users[:id]))
    else
      dataset.where(:users[:id] => member.id)
    end
  end

  scope(:passenger_form) do |member|
    # when editing booker as passenger on passenger form, have to allow to render
    # all bookers that are assigned to current booker as passenger
    if member.booker?
      member.company.bookers_dataset.select_all(:users)
        .where{ (:users[:id] =~ member.id) | (:users[:id] =~ member.bookers_dataset.select(:users[:id])) }
    else
      scope[member]
    end
  end

  def execute?
    member.company.bbc? || !member.passenger?
  end

  def add_booker?
    policy(:create).execute?
  end

  def export_bookers?
    policy(:export).execute?
  end
end
