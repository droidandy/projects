require 'rails_helper'

RSpec.describe Passengers::AutomaticImport, type: :service do
  describe '#execute' do
    let(:admin) { create(:companyadmin) }
    let(:company) { admin.company }
    let(:csv_file_path) { "#{Rails.root}/spec/fixtures/import_passengers/travel_manager_role.csv" }
    let(:message_delivery) { instance_double(ActionMailer::MessageDelivery) }
    let(:phone_number_service_stub) { double }
    let(:phone_number_service_result_stub) { double }

    service_context { { company: company } }

    subject(:service) { described_class.new(company: company, csv_file_path: csv_file_path) }

    before { allow(Faye).to receive(:notify) }

    it 'calls phone number internationalizer twice' do
      expect(phone_number_service_stub).to receive(:execute).and_return(phone_number_service_result_stub).at_least(:twice)
      expect(phone_number_service_result_stub).to receive(:result).and_return('').at_least(:twice)
      expect(::PhoneNumbers::Internationalizer).to receive(:new).and_return(phone_number_service_stub).at_least(:twice)

      service.execute
    end

    describe 'execution' do
      context 'for existing passenger' do
        # email in csv file contains capital letters, spaces and newline character
        let!(:passenger) { create(:finance, email: 'adrian.belt@email.com', company: company, added_through_hr_feed: true) }

        it "doesn't deactivate passenger just because email in the file contains capital letters" do
          service.execute
          expect(passenger.reload).to be_active
        end
      end
    end

    describe 'notify of errors' do
      context 'handle line errors' do
        let(:line_errors) { [{ line: 3, errors: ['error text'] }] }
        let(:encoding_error) { nil }

        it 'send report' do
          expect(ImportMailer).to receive(:error_report)
            .with(company.id, line_errors, encoding_error).and_return(message_delivery)
          allow(message_delivery).to receive(:deliver_later)

          service.send(:handle_line_error, line: 3, status: 'status', errors: ['error text'])
          service.execute!
        end
      end

      context 'handle encoding errors' do
        let(:line_errors) { nil }
        let(:encoding_error) { true }

        before do
          allow(service).to receive(:process_with_encoding).and_raise(ArgumentError, 'invalid byte sequence in UTF-8')
        end

        it 'send report' do
          expect(ImportMailer).to receive(:error_report)
            .with(company.id, line_errors, encoding_error).and_return(message_delivery)
          allow(message_delivery).to receive(:deliver_later)

          service.execute!
        end
      end
    end
  end
end
