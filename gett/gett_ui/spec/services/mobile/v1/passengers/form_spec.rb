require 'rails_helper'

RSpec.describe Mobile::V1::Passengers::Form, type: :service do
  let(:payment_types) { ['account', 'cash'] }
  let(:company)       { create(:company, payment_types: payment_types) }
  let(:admin)         { create(:admin, company: company) }
  let(:passenger)     { create(:passenger, company: company) }

  subject(:service) { described_class.new(passenger: passenger) }

  it { is_expected.to be_authorized_by(Passengers::FormPolicy) }

  describe '#execute' do
    service_context { { company: admin.company, member: admin } }

    subject(:result) { service.execute.result }

    it 'contains all fields' do
      expect(result.keys).to contain_exactly(
        :passenger,
        :last_logged_in_at,
        :company_payment_types,
        :member_id,
        :bookers,
        :work_roles,
        :departments,
        :member_roles,
        :payment_cards,
        :favorite_addresses,
        :payroll_required,
        :cost_centre_required,
        :locations,
        :can,
        :company_custom_attributes,
        :company_type,
        :company_name
      )
    end

    describe 'passenger information' do
      subject { result[:passenger].stringify_keys.keys }

      it do
        is_expected.to contain_exactly(
          'id',
          'email',
          'first_name',
          'last_name',
          'phone',
          'mobile',
          'work_role_id',
          'department_id',
          'onboarding',
          'role_type',
          'notify_with_sms',
          'notify_with_email',
          'notify_with_push',
          'notify_with_calendar_event',
          'wheelchair_user',
          'vip',
          'allow_preferred_vendor',
          'payroll',
          'cost_centre',
          'division',
          'default_vehicle',
          'booker_pks',
          'passenger_pks',
          'home_address',
          'work_address',
          'active',
          'avatar_url',
          'avatar_versions',
          'self_assigned',
          'custom_attributes',
          'default_phone_type',
          'is_passenger_for_current_member',
          'can'
        )
      end
    end
  end
end
