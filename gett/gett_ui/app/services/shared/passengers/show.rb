module Shared::Passengers
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include HomePrivacy::AddressHelpers

    attributes :passenger

    def execute!
      passenger_data.merge(
        'active' => passenger.active?,
        # value used on PassengerForm to let bookers unassign themselves from passengers
        'self_assigned' => (passenger.booker_pks & [current_user.id]).first
      )
    end

    private def passenger_data
      passenger.as_json(
        only: [
          :id,
          :email,
          :first_name,
          :last_name,
          :phone,
          :mobile,
          :work_role_id,
          :department_id,
          :onboarding,
          :role_type,
          :notify_with_sms,
          :notify_with_email,
          :notify_with_push,
          :notify_with_calendar_event,
          :wheelchair_user,
          :vip,
          :allow_preferred_vendor,
          :payroll,
          :cost_centre,
          :division,
          :default_vehicle,
          :avatar_url,
          :avatar_versions
        ],
        include: [
          :booker_pks,
          :passenger_pks,
          :custom_attributes
        ]
      ).deep_merge(
        'home_address' => safe_address_as_json(passenger.home_address),
        'work_address' => safe_address_as_json(passenger.work_address),
        'custom_attributes' => {
          pd_accepted: passenger.pd_eligible?,
          pd_expires_at: passenger.pd_expires_at,
          pd_status: passenger.bbc_pd_status
        }
      )
    end
  end
end
