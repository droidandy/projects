module TravelRules
  class VehicleAvailabilityPolicy < ServicePolicy
    allow_all!

    def allow_manual?
      user.user_role_name != 'outsourced_customer_care'
    end
  end
end
