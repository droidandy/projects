require 'rails_helper'

RSpec.describe Passengers::Update, type: :service do
  it { is_expected.to be_authorized_by(Passengers::UpdatePolicy) }

  describe '#execute' do
    let(:company) { create(:company) }
    let!(:admin)  { create(:companyadmin, company: company) }

    let(:home_address) { create(:address) }
    let(:work_address) { create(:address) }

    service_context { { member: admin, company: company } }

    let(:passenger)   { create(:passenger, first_name: 'John', company: company) }
    subject(:service) { Passengers::Update.new(passenger: passenger, params: params) }

    context 'with valid params' do
      context 'passenger has home and work addresses' do
        let!(:home_passenger_address) do
          create(:passenger_address, :home, address_id: home_address.id, passenger_id: passenger.id)
        end
        let!(:work_passenger_address) do
          create(:passenger_address, :work, address_id: work_address.id, passenger_id: passenger.id)
        end
        let(:params) do
          {
            first_name: 'changed',
            role_type: 'booker',
            notify_with_calendar_event: true,
            default_phone_type: 'mobile',
            home_address: {
              line: 'new home address',
              lat: 1,
              lng: 2,
              country_code: 'GB',
              city: 'London'
            },
            work_address: {
              line: 'new work address',
              lat: 3,
              lng: 4,
              country_code: 'GB',
              city: 'London'
            }
          }
        end

        describe 'updated passenger' do
          before { service.execute }

          subject { service.passenger.reload }

          its(:first_name) { is_expected.to eq 'changed' }
          its(:role_type)  { is_expected.to eq :booker }
          its(:notify_with_calendar_event) { is_expected.to be_truthy }
          its(:default_phone_type) { is_expected.to eq 'mobile' }
          its('home_address.line') { is_expected.to eq 'new home address' }
          its('work_address.line') { is_expected.to eq 'new work address' }
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:errors) { is_expected.to be_blank }
        end

        context 'when passenger is superadmin' do
          let(:params)    { super().merge(role_type: 'admin') }
          let(:passenger) { admin }

          before { service.execute }

          it 'does not updates role' do
            expect(passenger.reload.role_name).to eq 'companyadmin'
          end
        end
      end

      context 'passenger has no home and work addresses' do
        let(:params) do
          passenger.values.merge(
            home_address: { line: 'home address', lat: 1, lng: 2, country_code: 'GB', city: 'London' },
            work_address: { line: 'work address', lat: 3, lng: 4, country_code: 'GB', city: 'London' }
          )
        end

        it 'creates new PassengerAddresses and Addresses' do
          expect{ service.execute }.to change_counts_by(
            PassengerAddress => 2,
            Address => 2
          )
        end

        describe 'created addresses have proper values' do
          before { service.execute }

          subject { service.passenger.reload }

          its('home_address.line') { is_expected.to eq 'home address' }
          its('work_address.line') { is_expected.to eq 'work address' }
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:errors) { is_expected.to be_blank }
        end
      end

      context 'when onboarding has been enabled' do
        let(:params) { passenger.values.merge(onboarding: 'true') }

        it 'sets reset password token to passenger' do
          expect(passenger).to receive(:set_reset_password_token!)
          service.execute
        end

        it 'sends invitation' do
          expect{ service.execute }.to change(ActionMailer::Base.deliveries, :size).by(1)
        end

        context 'and passenger already was onboarded' do
          let(:passenger) { create(:passenger, onboarding: 'true') }

          it 'does not set reset password token to passenger' do
            expect(passenger).not_to receive(:set_reset_password_token!)
            service.execute
          end

          it 'does not send invitation' do
            expect{ service.execute }.not_to change(ActionMailer::Base.deliveries, :size)
          end
        end
      end

      context 'when onboarding has been disabled' do
        let(:params) { passenger.values.merge(onboarding: 'false') }

        it 'does not set reset password token to passenger' do
          expect(passenger).not_to receive(:set_reset_password_token!)
          service.execute
        end

        it 'does not send invitation' do
          expect{ service.execute }.not_to change(ActionMailer::Base.deliveries, :size)
        end
      end

      context 'booker assigned passenger to himself' do
        let!(:booker) { create(:booker, company: admin.company) }
        service_context { { member: booker, company: admin.company } }

        let(:params) do
          passenger.values.merge(
            first_name: 'changed',
            self_assigned: booker.id,
            booker_pks: []
          )
        end

        it 'assigns passenger to booker' do
          service.execute
          expect(passenger.reload.bookers).to include(booker)
        end
      end

      context 'updated by booker' do
        let!(:booker) { create(:booker, company: admin.company, passenger_pks: [passenger.id]) }
        service_context { { member: booker, company: admin.company } }

        let(:params) do
          passenger.values.merge(
            first_name: 'changed',
            self_assigned: booker.id,
            booker_pks: []
          )
        end

        it 'assigns passenger to booker' do
          service.execute
          expect(passenger.reload.bookers).to include(booker)
        end
      end

      context 'when BBC company' do
        let(:company)   { create(:company, :bbc) }
        let(:passenger) { create(:passenger, :bbc_staff, company: company) }

        let!(:home_passenger_address) do
          create(:passenger_address, :home, address_id: home_address.id, passenger_id: passenger.id)
        end
        let!(:work_passenger_address) do
          create(:passenger_address, :work, address_id: work_address.id, passenger_id: passenger.id)
        end

        # home-work addresses required for BBC with pd_accepted and always come from UI,
        # unless it's a request to update passenger's default vehicle type
        let(:base_params) do
          {
            home_address: home_passenger_address.address.to_hash.slice(:line, :lat, :lng, :country_code, :city),
            work_address: work_passenger_address.address.to_hash.slice(:line, :lat, :lng, :country_code, :city)
          }
        end

        context 'when pd is accepted by passenger' do
          service_context { {member: passenger, company: company} }

          let(:params) { {custom_attributes: {pd_accepted: true}} }

          before { Timecop.freeze }
          after  { Timecop.return }

          specify { expect(service.execute).to be_success }

          it 'updates pd_accepted_at custom attribute' do
            expect{ service.execute }.to change{ passenger.pd_accepted_at }.from(nil).to(Time.current)
          end

          context 'when pd is expired' do
            let(:passenger) do
              create(
                :passenger, :bbc_staff,
                company: company,
                custom_attributes: {
                  'pd_type' => Member::BBC::PdType::STAFF,
                  'pd_accepted' => true,
                  'pd_expires_at' => 1.day.ago.to_date.to_s,
                  'pd_accepted_at' => 1.year.ago.to_date.to_s
                }
              )
            end

            it 'updates pd_accepted_at custom attribute' do
              expect{ service.execute }.to change{ passenger.pd_eligible? }.from(false).to(true)
            end
          end
        end

        context 'when passenger is updated by admin' do
          let(:passenger) { create(:passenger, :bbc_staff, :pd_accepted, company: company) }

          context 'when pd-related attribute is not changed' do
            let(:params) do
              base_params.merge(custom_attributes: { hw_exemption_time_from: '22:30' })
            end

            specify { expect(service.execute).to be_success }

            it 'does not drop pd_accepted_at value' do
              expect{ service.execute }.not_to change{ passenger.pd_accepted_at }
            end
          end

          context 'pd-related attribute' do
            pd_specific_params = {
              role_type:  { role_type: 'finance' },
              first_name: { first_name: 'homer' },
              last_name:  { last_name: 'simpson' },
              pd_type:    { custom_attributes: { pd_type: 'freelancer' }},
              phone:      { phone: '+123123321321'},
              email:      { email: 'homer@cool.man' },
              wh_travel:  { custom_attributes: { wh_travel: false } },
              home_address: {
                home_address: { line: 'new home address', lat: 11, lng: 22, country_code: 'GB', city: 'London' }
              },
              work_address: {
                work_address: { line: 'new work address', lat: 33, lng: 44, country_code: 'GB', city: 'London' }
              }
            }

            pd_specific_params.each do |param_name, params_data|
              context "#{param_name} changed" do
                let(:params) { base_params.merge(params_data) }

                specify { expect(service.execute).to be_success }

                it 'drops pd_accepted_at value and set pd_expires to 29 days' do
                  service.execute

                  expect(passenger.pd_accepted_at).to be_nil
                  expect(passenger.pd_expires_at).to eq Date.current + 29.days
                end
              end
            end
          end
        end

        context 'when home address removed' do
          let(:params) do
            base_params.merge(home_address: nil)
          end

          it 'removes passenger home address' do
            expect(service.execute).to be_success
            expect(passenger.home_address).to be_blank
          end

          context 'passenger is ThinPD' do
            let(:params) do
              super().merge(custom_attributes: { pd_status: 'thin_pd' })
            end

            it 'removes passenger home address' do
              expect(service.execute).to be_success
              expect(passenger.home_address).to be_blank
            end
          end

          context 'passenger is FullPD' do
            let(:params) do
              super().merge(custom_attributes: { pd_status: 'full_pd' })
            end

            specify { expect(service.execute).not_to be_success }
          end
        end

        context 'when work address removed' do
          let(:params) do
            base_params.merge(work_address: nil)
          end

          it 'removes passenger work address' do
            expect(service.execute).to be_success
            expect(passenger.work_address).to be_blank
          end

          context 'passenger is ThinPD' do
            let(:params) do
              super().merge(custom_attributes: { pd_status: 'thin_pd' })
            end

            specify { expect(service.execute).not_to be_success }
          end

          context 'passenger is FullPD' do
            let(:params) do
              super().merge(custom_attributes: { pd_status: 'full_pd' })
            end

            specify { expect(service.execute).not_to be_success }
          end
        end

        context 'when home and/or work address was not submitted' do
          let(:params) { {default_vehicle: 'Standard'} }

          it 'updates specified fields without triggering address-specific logic' do
            expect(service).not_to receive(:assign_home_address)
            expect(service).not_to receive(:assign_work_address)

            expect(service.execute).to be_success
            expect(passenger.default_vehicle).to eq('Standard')
          end
        end

        context 'when allowed excess mileage is assigned' do
          let(:passenger) { create(:passenger, :bbc_staff, company: company) }

          let(:params) { {custom_attributes: {allowed_excess_mileage: 12}} }

          specify { expect(service.execute).to be_success }

          it 'sets execess mileage value' do
            expect { service.execute }.to change(passenger, :allowed_excess_mileage).to(12)
          end
        end

        describe 'update pd acceptance' do
          let(:passenger) { create(:passenger, :bbc_staff, company: company) }
          let(:params) do
            { custom_attributes: { pd_accepted: true } }
          end

          service_context { {member: passenger, company: company} }

          it 'drops pd_accepted_at value and set pd_expires to 29 days' do
            execute_result = service.execute

            passenger.reload

            expect(execute_result).to be_success
            expect(passenger.pd_accepted_at.to_i).to eq Time.current.to_i
            expect(passenger.pd_expires_at).to eq Date.current + 1.year
          end
        end
      end
    end

    context 'with invalid params' do
      let(:params) { { first_name: '', payroll: '', cost_centre: '' } }

      let!(:company) { create(:company, payroll_required: true, cost_centre_required: true) }
      let!(:admin) { create(:companyadmin, company: company) }

      it 'does not update booker' do
        expect{ service.execute }.not_to change{ passenger.reload.first_name }
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
