using Sequel::CoreRefinements

class Passengers::IndexPolicy < ServicePolicy
  allow_all!

  scope do |member|
    dataset = member.company.passengers_dataset

    if member.executive? || (!member.company.bbc? && member.finance?)
      dataset
    elsif member.booker?
      booker_passengers = member.passengers_dataset.select(:users[:id])

      dataset.where{ (:users[:id] =~ booker_passengers) | (:users[:id] =~ member.id) }
    else
      dataset.where(:users[:id] => member.id)
    end
  end

  def add_passenger?
    policy(:create).execute?
  end

  def have_passenger? # rubocop:disable Naming/PredicateName
    !member.passenger?
  end

  def export_passengers?
    policy(:export).execute?
  end

  def import_passengers?
    policy(:manual_import).execute?
  end

  def invite_all_passengers?
    policy(Members::InviteAllPolicy).execute?
  end
end
