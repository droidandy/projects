require 'rails_helper'

RSpec.describe Passengers::Show, type: :service do
  it { is_expected.to be_authorized_by(Passengers::ShowPolicy) }

  describe '#execute' do
    service_context { { member: passenger } }

    let(:passenger)   { create :passenger, first_name: 'John' }
    subject(:service) { Passengers::Show.new(passenger: passenger) }

    subject { service.execute.result.with_indifferent_access }

    it do
      is_expected.to include(
        :id,
        :email,
        :first_name,
        :last_name,
        :phone,
        :mobile,
        :active,
        :work_role_id,
        :department_id,
        :onboarding,
        :role_type,
        :notify_with_sms,
        :notify_with_email,
        :wheelchair_user,
        :payroll,
        :cost_centre,
        :division,
        :booker_pks,
        :home_address,
        :work_address,
        :avatar_url,
        :avatar_versions,
        :self_assigned,
        :custom_attributes
      )
    end
  end
end
