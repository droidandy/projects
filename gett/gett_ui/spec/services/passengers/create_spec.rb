require 'rails_helper'

RSpec.describe Passengers::Create, type: :service do
  it { is_expected.to be_authorized_by(Passengers::CreatePolicy) }

  describe '#execute' do
    service_context { { member: admin, company: admin.company } }

    let!(:admin)  { create(:companyadmin) }
    let!(:booker) { create(:booker) }

    subject(:service) { Passengers::Create.new(params: params) }

    context 'with valid params' do
      let(:params) do
        {
          email:      'booker@email.com',
          first_name: 'John',
          last_name:  'Smith',
          phone:      '+3111222244',
          booker_pks: [booker.id],
          onboarding: onboarding,
          notify_with_calendar_event: true,
          home_address: {
            line: '221 Baker street',
            lat: 1,
            lng: 2,
            country_code: 'GB',
            city: 'London'
          },
          work_address: {
            line: 'Buckingham Palace London SW1A 1 АА',
            lat: 3,
            lng: 4,
            country_code: 'GB',
            city: 'London'
          }
        }
      end
      let(:onboarding) { nil }

      it 'creates new Passenger, PassengerAddresses, Addresses' do
        expect{ service.execute }.to change_counts_by(
          Member => 1,
          PassengerAddress => 2,
          Address => 2
        )
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:passenger) { is_expected.to be_persisted }
        its('passenger.notify_with_calendar_event') { is_expected.to be_truthy }
        its('passenger.role_name') { is_expected.to eq 'passenger' }
        its('passenger.default_vehicle') { is_expected.to eq 'BlackTaxi' }
        its('passenger.home_address.line') { is_expected.to eq '221 Baker street' }
        its('passenger.work_address.line') { is_expected.to eq 'Buckingham Palace London SW1A 1 АА' }
        its(:errors) { is_expected.to be_blank }
      end

      it 'does not send invitation' do
        expect{ service.execute }.not_to change(ActionMailer::Base.deliveries, :size)
      end

      context 'when onboarding is true' do
        let(:onboarding) { 'true' }

        it 'is successful' do
          expect(service.execute).to be_success
        end

        it 'sets reset password token to passenger' do
          expect_any_instance_of(Member).to receive(:set_reset_password_token!)
          service.execute
        end

        it 'sends invitation' do
          expect{ service.execute }
            .to change(ActionMailer::Base.deliveries, :size).by(1)
        end
      end

      context 'when onboarding is false' do
        let(:onboarding) { 'false' }

        it { expect(service.execute).to be_success }

        it 'does not send invitation' do
          expect{ service.execute }.not_to change(ActionMailer::Base.deliveries, :size)
        end
      end

      context 'when role_type is present in params' do
        shared_examples_for 'execution with proper role assignment' do |role|
          let(:params) { super().merge(role_type: role) }

          describe 'execution results' do
            before { service.execute }

            it { is_expected.to be_success }
            its(:passenger) { is_expected.to be_persisted }
            its('passenger.role_name') { is_expected.to eq role }
          end
        end

        context 'when role_type is passenger' do
          it_behaves_like 'execution with proper role assignment', 'passenger'
        end

        context 'when role_type is booker' do
          it_behaves_like 'execution with proper role assignment', 'booker'
        end

        context 'when role_type is admin' do
          it_behaves_like 'execution with proper role assignment', 'admin'
        end
      end

      context 'when BBC company' do
        service_context { { member: admin, company: admin.company } }

        let(:company) { create(:company, :bbc) }
        let!(:admin)  { create(:admin, company: company) }
        let(:params) do
          super().merge(
            custom_attributes: { pd_type: 'freelancer' }
          )
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:passenger) { is_expected.to be_persisted }
          its('passenger.pd_expires_at') { is_expected.to be nil }
          its(:errors) { is_expected.to be_blank }
        end

        context 'passenger is a BBC staff' do
          let(:params) do
            super().merge(
              custom_attributes: { pd_type: 'staff' }
            )
          end

          describe 'execution results' do
            before { service.execute }

            it { is_expected.to be_success }
            its(:passenger) { is_expected.to be_persisted }
            its('passenger.pd_expires_at') { is_expected.to eq Date.current + 29.days }
            its(:errors) { is_expected.to be_blank }
          end
        end
      end
    end

    context 'with invalid params' do
      let(:params) { { first_name: '' } }

      let!(:company) { create(:company, payroll_required: true, cost_centre_required: true) }
      let!(:admin) { create(:companyadmin, company: company) }

      it 'does not create new Member' do
        expect{ service.execute }.not_to change(Member, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }

        it 'validates payroll' do
          expect(subject.errors[:payroll]).to be_present
        end

        it 'validates cost_centre' do
          expect(subject.errors[:cost_centre]).to be_present
        end
      end
    end
  end
end
