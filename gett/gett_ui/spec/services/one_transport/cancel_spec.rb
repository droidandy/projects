require 'rails_helper'

RSpec.describe OneTransport::Cancel, type: :service do
  subject(:service) { described_class.new(booking: booking) }
  let(:booking) { create(:booking, :ot) }
  let(:response_body) do
    {
      job_cancel_response: {
        job_cancel_result: {
          header: {
            result: {
              code: '0',
              message: nil
            }
          }
        }
      }
    }
  end

  describe '#execute' do
    before do
      expect(Savon).to receive(:client).with(
        wsdl: 'http://localhost/ot',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        open_timeout: 120,
        read_timeout: 120
      ).and_return(double(
        operations: [:job_cancel],
        call: double(body: response_body)
      ))

      expect(service).to receive(:booker).and_return(person_ID: 'id')
    end

    it 'executes sucessfully' do
      expect(service.execute).to be_success
    end
  end
end
