require 'rails_helper'

RSpec.describe Gett::Cancel, type: :service do
  subject(:service) { Gett::Cancel.new(booking: booking) }

  describe '#execute' do
    let(:company) { create(:company, gett_business_id: 'gett_id') }
    let(:address) { create(:address, :baker_street) }
    let(:booking) { create(:booking, company: company, service_id: 'foo', pickup_address: address) }

    service_context { {company: company} }

    before do
      expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

      stub_request(:post, "http://localhost/business/rides/foo/cancel?business_id=gett_id").to_return(response)
    end

    context 'when succeeds' do
      let(:response) { {status: 200, body: "{}"} }

      specify { expect(service.execute).to be_success }
    end

    context 'when failed' do
      let(:response) { {status: 404, body: {error_description: 'Too late'}.to_json} }

      it 'has error message' do
        service.execute
        expect(service.error_message).to eq('Too late')
      end
    end
  end
end
