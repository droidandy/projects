using Sequel::CoreRefinements

class Companies::DashboardPolicy < ServicePolicy
  allow_all!

  scope(:bookings) do |member|
    next member.bookings_dataset if member.company.bbc?

    Bookings::IndexPolicy.scope.call(member)
  end

  def edit?
    member.executive?
  end

  def send_internal_message?
    Messages::CreateInternalPolicy.new(user, service).execute?
  end
end
