require 'rails_helper'

RSpec.describe Passengers::ManualImport, type: :service do
  it { is_expected.to be_authorized_by(Passengers::ManualImportPolicy) }

  describe '#execute' do
    let!(:admin)          { create(:companyadmin, company: company) }
    let(:company)         { create(:company, address_id: company_address.id) }
    let(:company_address) { create(:address) }
    let(:file_name)       { 'travel_manager_role' }
    let(:file) do
      ActionDispatch::Http::UploadedFile.new(
        filename: 'passengers.csv',
        type: 'text/csv',
        tempfile: File.new("#{Rails.root}/spec/fixtures/import_passengers/#{file_name}.csv")
      )
    end
    let(:params) { {file: file, onboarding: 'false'} }
    let(:phone_number_service_stub) { double }
    let(:phone_number_service_result_stub) { double }

    service_context { {company: company, member: admin} }

    subject(:service) { described_class.new(params: params) }

    before { allow(Faye).to receive(:notify) }

    context 'for new passenger' do
      it 'creates new passenger' do
        expect{ service.execute }.to change(Member, :count).by(1)
      end

      it 'assigns correct work address' do
        service.execute
        expect(Member.last.work_address.line).to eq company_address.line
      end

      it 'calls phone number internationalizer twice' do
        expect(phone_number_service_stub).to receive(:execute).and_return(phone_number_service_result_stub).at_least(:twice)
        expect(phone_number_service_result_stub).to receive(:result).and_return('').at_least(:twice)
        expect(::PhoneNumbers::Internationalizer).to receive(:new).and_return(phone_number_service_stub).at_least(:twice)

        service.execute
      end

      describe 'member role' do
        before { service.execute }

        context 'role is present in csv' do
          it { expect(Member.last.role_name).to eq('travelmanager') }
        end

        context 'role is absent in csv' do
          let(:file_name) { 'blank_role' }

          it { expect(Member.last.role_name).to eq('passenger') }
        end
      end

      describe 'created passenger' do
        before  { service.execute }
        subject { Member.last }

        its(:onboarding) { is_expected.to be nil }

        context 'when onboarding is true' do
          let(:params) { {file: file, onboarding: 'true'} }

          its(:onboarding) { is_expected.to be true }
        end
      end

      context 'new department and work role' do
        it 'creates new department' do
          expect{ service.execute }.to change(Department, :count).by(1)
        end

        it 'creates new work role' do
          expect{ service.execute }.to change(WorkRole, :count).by(1)
        end
      end

      context 'when related department and work role exist' do
        let!(:department) { create(:department, company: company, name: 'Sales') }
        let!(:work_role) { create(:work_role, company: company, name: 'Manager') }

        it 'assigns existing department' do
          service.execute
          expect(Member.last.department).to eq department
        end

        it 'assigns existing work role' do
          service.execute
          expect(Member.last.work_role).to eq work_role
        end
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'for existing passenger' do
      # email in csv file contains capital letters, spaces and newline character
      let!(:passenger) { create(:finance, email: 'adrian.belt@email.com', company: company, first_name: 'old') }

      it 'calls phone number internationalizer twice' do
        expect(phone_number_service_stub).to receive(:execute).and_return(phone_number_service_result_stub).at_least(:twice)
        expect(phone_number_service_result_stub).to receive(:result).and_return('').at_least(:twice)
        expect(::PhoneNumbers::Internationalizer).to receive(:new).and_return(phone_number_service_stub).at_least(:twice)

        service.execute
      end

      describe 'member role' do
        before { service.execute }

        context 'when role is present in csv' do
          it 'changes role to specified one' do
            expect(Member.last.role_name).to eq('travelmanager')
          end
        end

        context 'when role is absent in csv' do
          let(:file_name) { 'blank_role' }

          it 'leaves role as it is' do
            expect(Member.last.role_name).to eq('finance')
          end
        end
      end

      context 'existing user is companyadmin' do
        let(:file_name)  { 'inactive_blank_role' }
        let!(:passenger) { create(:companyadmin, email: 'adrian.belt@email.com', company: company) }

        describe 'status' do
          it 'is expected not to be changed to inactive' do
            service.execute
            expect(passenger.reload).to be_active
          end
        end
      end

      context 'inactive passenger' do
        let!(:passenger) { create(:finance, :inactive, email: 'adrian.belt@email.com', company: company, first_name: 'old') }

        describe 'status' do
          it 'is expected to be changed to active' do
            service.execute
            expect(passenger.reload).to be_active
          end
        end
      end

      context 'without existing work address' do
        before { service.execute }

        it 'updates passenger' do
          expect(passenger.reload.first_name).to eq 'Adrian'
        end

        it 'assigns correct work address to updated passenger' do
          expect(Member.last.work_address.line).to eq company_address.line
        end
      end

      context 'with existing home address' do
        let!(:home_address) { create(:passenger_address, :home, passenger: passenger) }

        before { service.execute }

        it 'keeps work address untouched' do
          expect(Member.last.home_address.id).to eq home_address.address_id
        end
      end

      context 'with existing work address' do
        let!(:work_address) { create(:passenger_address, :work, passenger: passenger) }

        before { service.execute }

        it 'keeps work address untouched' do
          expect(Member.last.work_address.id).to eq work_address.address_id
        end
      end

      describe 'onboarding' do
        let(:params)     { { file: file, onboarding: import_settings_onboarding } }
        let!(:passenger) { create(:passenger, email: 'adrian.belt@email.com', company: company, onboarding: passenger_onboarding) }

        before { service.execute }

        context 'when params[:onboarding] is false' do
          let(:import_settings_onboarding) { 'false' }

          context 'member.onboarding is true' do
            let(:passenger_onboarding) { true }

            it 'changes onboarding to nil' do
              expect(passenger.reload.onboarding).to be nil
            end
          end

          context 'member.onboarding is false' do
            let(:passenger_onboarding) { false }

            it 'does not change onboarding from false' do
              expect(passenger.reload.onboarding).to be false
            end
          end
        end

        context 'when params[:onboarding] is true' do
          let(:import_settings_onboarding) { 'true' }

          context 'member.onboarding is nil' do
            let(:passenger_onboarding) { nil }

            it 'changes onboarding to true' do
              expect(passenger.reload.onboarding).to be true
            end
          end

          context 'member.onboarding is false' do
            let(:passenger_onboarding) { false }

            it 'does not change onboarding from false' do
              expect(passenger.reload.onboarding).to be false
            end
          end
        end
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'for present non-passenger user' do
      let!(:booker) { create :booker, email: 'adrian.belt@email.com' }

      it 'does not create new Member' do
        expect{ service.execute }.not_to change(Member, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end

    context 'for missing passenger added through UI' do
      let!(:passenger) { create(:passenger, company: company, added_through_hr_feed: false) }

      it 'does not disable the passenger' do
        service.execute
        expect(passenger.reload).to be_active
      end
    end

    context 'for missing passenger added throuh import' do
      let!(:passenger) { create(:passenger, company: company, added_through_hr_feed: true) }

      it 'does disables the passenger' do
        service.execute
        expect(passenger.reload).to_not be_active
      end
    end

    context 'for file with incorrect encoding' do
      it 'sends message to channel' do
        expect(CSV).to receive(:foreach).and_raise(ArgumentError.new('invalid byte sequence in UTF-8')).twice
        expect(Faye).to receive(:notify)
          .with("import-#{admin.id}", processing_error: I18n.t('passengers.import.errors.invalid_encoding'))
        service.execute
      end

      it 'raise error and does not send message if another error' do
        expect(CSV).to receive(:foreach).and_raise(ArgumentError.new('other error')).twice
        expect(Faye).not_to receive(:notify)
        expect{ service.execute }.to raise_error(ArgumentError)
      end
    end

    describe '#total_lines' do
      it 'ignores empty lines in file' do
        expect(service.send(:total_lines)).to eq(1)
      end
    end
  end
end
