class Invoices::Policy < ServicePolicy
  def execute?
    member.role_name&.in? %w[companyadmin admin finance travelmanager]
  end
end
