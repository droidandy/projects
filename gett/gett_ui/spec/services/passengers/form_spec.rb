require 'rails_helper'

RSpec.describe Passengers::Form, type: :service do
  let(:payment_types) { ['account', 'cash'] }
  let(:company)       { create(:company, payment_types: payment_types) }
  let(:admin)         { create(:admin, company: company) }
  let(:passenger)     { create(:passenger, company: company) }

  subject(:service) { Passengers::Form.new(passenger: passenger) }

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
      subject { result[:passenger].keys }

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
          'is_passenger_for_current_member',
          'can'
        )
      end

      context 'when the company is inactive but the user is active' do
        before { admin.company.active = false }

        it 'correctly consider user inactive' do
          expect(result[:passenger]['active']).to be false
        end
      end
    end

    describe '[:locations]' do
      let!(:location_z) { create(:location, company: company, name: 'Z-Location') }
      let!(:location_a) { create(:location, company: company, name: 'A-Location') }

      subject { result[:locations].pluck('id') }

      it { is_expected.to eq([location_a.id, location_z.id]) }
    end

    describe 'permissions' do
      subject { result[:can].keys }

      it do
        is_expected.to contain_exactly(
          :edit_all,
          :change_active,
          :assign_bookers,
          :assign_self,
          :change_email,
          :change_department,
          :change_work_role,
          :change_role,
          :change_payroll,
          :change_cost_centre,
          :change_division,
          :add_payment_cards,
          :delete_payment_cards,
          :see_log,
          :reinvite,
          :change_personal_card_usage,
          :see_payment_cards,
          :edit_bbc_attrs,
          :accept_pd,
          :change_pd,
          :change_wheelchair
        )
      end

      describe 'can see payment cards' do
        subject { result[:can][:see_payment_cards] }

        context 'company has account and cash payment types' do
          it { is_expected.to be false }
        end

        context 'company has company payment card type' do
          let(:payment_types) { ['company_payment_card'] }

          it { is_expected.to be false }
        end

        context 'company has passenger payment card type' do
          let(:payment_types) { ['passenger_payment_card'] }

          it { is_expected.to be true }

          context 'and company has bbc company type' do
            let(:company) { create(:company, :bbc, payment_types: payment_types) }

            it { is_expected.to be false }
          end
        end

        context 'company has passenger payment card periodic type' do
          let(:payment_types) { ['passenger_payment_card_periodic'] }

          it { is_expected.to be true }

          context 'and company has bbc company type' do
            let(:company) { create(:company, :bbc, payment_types: payment_types) }

            it { is_expected.to be false }
          end
        end
      end
    end
  end
end
