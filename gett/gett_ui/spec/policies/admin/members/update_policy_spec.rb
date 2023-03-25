require 'rails_helper'

RSpec.describe Admin::Members::UpdatePolicy, type: :policy do
  let(:admin)     { create(:user, :admin) }
  let(:passenger) { create(:passenger) }
  let(:service)   { Passengers::Update.new(passenger: passenger, params: {first_name: 'foo'}) }

  let(:policy) { Admin::Members::UpdatePolicy.new(admin, service) }

  describe '#permitted_passenger_params' do
    subject { policy.permitted_passenger_params }

    it 'includes the proper list of params' do
      is_expected.to include(
        :first_name, :last_name, :phone, :mobile, :work, :reference, :avatar,
        :onboarding, :notify_with_sms, :notify_with_email, :notify_with_push,
        :wheelchair_user, :active, :email, :work_role_id, :department_id, :booker_pks,
        :passenger_pks, :payroll, :cost_centre, :division, :active, :vip,
        :allow_personal_card_usage, :default_vehicle, :notify_with_calendar_event,
        :allow_preferred_vendor
      )
    end
  end

  describe '#permitted_custom_attribute_params' do
    subject { policy.permitted_custom_attribute_params }

    it 'includes the proper list of params' do
      is_expected.to include(
        :pd_type,
        :wh_travel,
        :exemption_p11d,
        :exemption_ww_charges,
        :exemption_wh_hw_charges,
        :hw_exemption_time_from,
        :hw_exemption_time_to,
        :wh_exemption_time_from,
        :wh_exemption_time_to,
        :allowed_excess_mileage
      )
    end
  end

  describe '#accept_pd?' do
    subject { policy.accept_pd? }

    it { is_expected.to be false }
  end
end
