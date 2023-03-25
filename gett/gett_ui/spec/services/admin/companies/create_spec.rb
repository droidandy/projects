require 'rails_helper'

RSpec.describe Admin::Companies::Create, type: :service do
  subject(:service) { Admin::Companies::Create.new(params: params) }

  describe '#execute' do
    context 'with valid params' do
      let!(:other_company) { create(:company) }

      let(:params) do
        {
          name: 'Company',
          sap_id: 'sap',
          booking_fee: '1.5',
          tips: '15.0',
          phone_booking_fee: '1.5',
          gett_cancellation_before_arrival_fee: '10',
          gett_cancellation_after_arrival_fee: '20',
          get_e_cancellation_before_arrival_fee: '25',
          get_e_cancellation_after_arrival_fee: '50',
          cancellation_before_arrival_fee: '25',
          cancellation_after_arrival_fee: '50',
          splyt_cancellation_before_arrival_fee: '0',
          splyt_cancellation_after_arrival_fee: '50',
          carey_cancellation_before_arrival_fee: '0',
          carey_cancellation_after_arrival_fee: '50',
          address: {
            line: 'address',
            lat: 2,
            lng: 3,
            country_code: 'GB',
            city: 'London'
          },
          legal_address: {
            line: 'legal address',
            lat: 2,
            lng: 3,
            country_code: 'GB',
            city: 'London'
          },
          payment_options: {
            payment_types: ['account', 'cash'],
            default_payment_type: 'account',
            invoicing_schedule: 'monthly',
            payment_terms: 30
          },
          admin: {
            first_name: 'First',
            last_name:  'Last',
            phone:      '+3111222244',
            email:      'email@spec.com',
            password:   '123123123',
            onboarding: onboarding
          },
          ddi: {
            type: 'standard'
          },
          gett_business_id: 'TestBusinessId',
          ot_username:      'TestUsername',
          ot_client_number: 'TestNumber',
          multiple_booking: false,
          payroll_required: true,
          cost_centre_required: true,
          customer_care_password: 'password',
          linked_company_pks: [other_company.id],
          quote_price_increase_percentage: 50,
          quote_price_increase_pounds: 20,
          international_booking_fee: 5,
          system_fx_rate_increase_percentage: 0,
          critical_flag_due_on: Date.current + 2.days,
          credit_rate_registration_number:  '12345',
          country_code: 'GB'
        }
      end
      let(:onboarding) { nil }

      it 'creates company, address records, payment options and booker' do
        expect{ service.execute }.to change_counts_by(
          Company => 1,
          Address => 2,
          CompanyInfo => 1,
          PaymentOptions => 1,
          Member => 1,
          Contact => 1
        )
      end

      context 'when hr feed is enabled' do
        let(:params) { super().merge(hr_feed_enabled: true) }
        let(:sftp_service) { double('Admin::Companies::EnableSftp') }

        it 'delegates to Admin::Companies::EnableSftp service' do
          expect(Admin::Companies::EnableSftp).to receive(:new)
            .with(company: service.company).and_return(sftp_service)
          expect(sftp_service).to receive(:execute)

          service.execute
        end
      end

      describe 'execution results' do
        describe 'created records' do
          before { service.execute }

          around do |example|
            Timecop.freeze(Time.current.change(nsec: 0))
            Sequel::Audited.enabled = true
            example.run
            Sequel::Audited.enabled = false
            Timecop.return
          end

          subject { service.company.reload }

          its(:name) { is_expected.to eq 'Company' }
          its('address.line')       { is_expected.to eq 'address' }
          its('legal_address.line') { is_expected.to eq 'legal address' }
          its('booking_fee')        { is_expected.to eq 1.5 }
          its('phone_booking_fee')  { is_expected.to eq 1.5 }
          its('gett_cancellation_before_arrival_fee') { is_expected.to eq 10.0 }
          its('gett_cancellation_after_arrival_fee') { is_expected.to eq 20.0 }
          its('get_e_cancellation_before_arrival_fee') { is_expected.to eq 25 }
          its('get_e_cancellation_after_arrival_fee') { is_expected.to eq 50 }
          its('cancellation_before_arrival_fee') { is_expected.to eq 25 }
          its('cancellation_after_arrival_fee') { is_expected.to eq 50 }
          its('splyt_cancellation_before_arrival_fee') { is_expected.to eq 0 }
          its('splyt_cancellation_after_arrival_fee') { is_expected.to eq 50 }
          its('carey_cancellation_before_arrival_fee') { is_expected.to eq 0 }
          its('carey_cancellation_after_arrival_fee') { is_expected.to eq 50 }
          its('payment_options.payment_types') { is_expected.to eq ['account', 'cash'] }
          its('admin.values') { is_expected.to include params[:admin].except(:password, :password_confirmation) }
          its('admin.role')   { is_expected.to eq Role[:companyadmin] }
          its('address.line') { is_expected.to eq 'address' }
          its('legal_address.line') { is_expected.to eq 'legal address' }
          its('primary_contact.first_name') { is_expected.to eq 'First' }
          its('primary_contact.last_name') { is_expected.to eq 'Last' }
          its('primary_contact.phone') { is_expected.to eq '+3111222244' }
          its('primary_contact.email') { is_expected.to eq 'email@spec.com' }
          its('primary_contact.address.line') { is_expected.to eq 'address' }
          its(:multiple_booking) { is_expected.to be false }
          its(:payroll_required) { is_expected.to be true }
          its(:cost_centre_required) { is_expected.to be true }
          its(:customer_care_password) { is_expected.to eq 'password' }
          its(:linked_companies) { is_expected.to eq [other_company] }
          its(:quote_price_increase_percentage) { is_expected.to eq 50 }
          its(:quote_price_increase_pounds) { is_expected.to eq 20 }
          its(:international_booking_fee) { is_expected.to eq 5 }
          its(:critical_flag_due_on) { is_expected.to eq Date.current + 2.days }
          its(:credit_rate_registration_number) { is_expected.to eq '12345' }
          its(:tips) { is_expected.to eq 15.0 }
          its(:sap_id) { is_expected.to eq 'sap' }
          its(:critical_flag_enabled_by) { is_expected.to eq 'system' }
          its(:critical_flag_enabled_at) { is_expected.to eq Time.current.to_datetime }
          its(:country_code) { is_expected.to eq 'GB' }

          context 'when bbc company selected' do
            let(:bbc_params) do
              {
                company_type: 'bbc',
                custom_attributes: {
                  travel_policy_mileage_limit: 40,
                  hw_deviation_distance: 10,
                  p11d: 10,
                  excess_cost_per_mile: 1.5
                }
              }
            end
            let(:params) { super().merge(bbc_params) }

            its(:travel_policy_mileage_limit) { is_expected.to eq(40) }
            its(:hw_deviation_distance)       { is_expected.to eq(10) }
            its(:p11d)                        { is_expected.to eq(10) }
            its(:excess_cost_per_mile)        { is_expected.to eq(1.5) }
          end
        end

        context 'when onboarding is nil' do
          before do
            expect_any_instance_of(Member).not_to receive(:set_reset_password_token!)
            expect_any_instance_of(MembersMailer).not_to receive(:admin_invitation)
            service.execute
          end

          it { is_expected.to be_success }
        end

        context 'when onboarding is true' do
          let(:onboarding) { true }

          before do
            expect_any_instance_of(Member).to receive(:set_reset_password_token!).and_call_original
            expect_any_instance_of(MembersMailer).to receive(:admin_invitation).and_call_original
            service.execute
          end

          it { is_expected.to be_success }
          its('company.admin.onboarding') { is_expected.to be true }
          its('company.admin.password') { is_expected.to be nil }
          its('company.admin.password_confirmation') { is_expected.to be nil }
        end

        context 'when multiple_booking is true' do
          before do
            params[:multiple_booking] = true
            service.execute
          end

          subject { service.company.reload }
          its(:multiple_booking) { is_expected.to be true }
        end

        context 'when api_enabled is true' do
          before { params[:api_enabled] = true }

          it 'creates an api key' do
            expect{ service.execute }.to change{ ApiKey.count }.by(1)
            expect(service.result.api_key).to be_present
          end
        end
      end
    end

    context 'with invalid params' do
      context 'when company and admin are invalid' do
        let(:params) { {name: '', admin: {}, payment_options: {}, address: {}} }

        it 'does not create nor Company nor Member' do
          expect{ service.execute }.to change_counts_by(
            Company => 0,
            Member => 0,
            Address => 0,
            Contact => 0,
            CompanyInfo => 0,
            Contact => 0
          )
        end

        describe 'execution results' do
          let(:error_keys) { [:name, 'admin.first_name', 'admin.last_name', 'admin.phone', 'admin.email'] }

          before { service.execute }

          it { is_expected.not_to be_success }
          its(:errors) { is_expected.to include(*error_keys) }
        end
      end

      context 'when only admin is invalid' do
        let(:params) do
          {
            name: 'Company',
            admin: {},
            payment_options: {},
            address: {
              line: 'address',
              lat: 2,
              lng: 3
            }
          }
        end

        it 'does not create neither Company nor any related record' do
          expect{ service.execute }.to change_counts_by(
            Company => 0,
            Member => 0,
            Address => 0,
            Contact => 0,
            CompanyInfo => 0,
            Contact => 0
          )
        end

        describe 'execution results' do
          let(:error_keys) { %w(admin.first_name admin.last_name admin.phone admin.email) }

          before { service.execute }

          it { is_expected.not_to be_success }
          its(:errors) { is_expected.to include(*error_keys) }
        end
      end

      context 'when everything but company is valid' do
        before { create(:company, name: 'Company') }

        let(:params) do
          {
            name: 'Company',
            booking_fee: 1.5,
            admin: {
              first_name: 'First',
              last_name: 'Last',
              phone: '+311122244',
              email: 'admin@email.com',
              password: '123123123'
            },
            payment_options: {
              payment_types: ['account']
            },
            address: {
              line: 'address',
              lat: 2,
              lng: 3,
              postal_code: 'PST CDE',
              city: 'London'
            }
          }
        end

        it 'does not crash' do
          expect{ service.execute }.not_to raise_error
        end

        specify { expect(service.execute).not_to be_success }
      end
    end
  end
end
