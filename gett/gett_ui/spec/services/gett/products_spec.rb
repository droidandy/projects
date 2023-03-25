require 'rails_helper'

RSpec.describe Gett::Products, type: :service do
  let(:response_body) { Rails.root.join('spec/fixtures/gett/products_response.json').read }
  let(:response)      { {status: 200, body: response_body} }
  let(:latitude)      { '32.1086622' }
  let(:longitude)     { '34.8379731' }
  let(:params) do
    {
      latitude: latitude,
      longitude: longitude,
      business_id: 'TestBusinessId'
    }
  end

  subject(:service) { described_class.new(address: { latitude: latitude, longitude: longitude }) }

  service_context { { company: create(:company) } }

  describe '#execute' do
    before do
      expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

      stub_request(:get, "http://localhost/business/products?#{params.to_param}")
        .to_return(response)

      service.execute
    end

    it { is_expected.to be_success }

    describe '#normalized_response' do
      subject { service.normalized_response }

      it 'includes available vehicles' do
        is_expected.to include(
          { value: "00407fdc-4385-4a22-9035-9d2d3e0a031a", name: "BlackTaxiXL" },
          { value: "5178cd83-20bf-4991-b559-c1128dfae662", name: "BlackTaxi" }
        )
      end
    end
  end

  describe 'business_id verification' do
    subject(:service) { described_class.new(verify_business_id: 'gett_business_id') }

    let(:params) do
      {
        business_id: 'gett_business_id',
        latitude: '51.528308',
        longitude: '-0.3817961'
      }
    end

    it 'checks products for specified business_id and hardcoded address' do
      allow(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

      stub_request(:get, "http://localhost/business/products?#{params.to_param}")
        .to_return(response)

      expect(service.execute).to be_success
    end
  end
end
