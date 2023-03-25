require 'rails_helper'

RSpec.describe Gett::Vehicles, type: :service do
  subject(:service) { described_class.new(attrs: params, allowed_services: [:gett]) }

  service_context { { company: create(:company) } }

  let(:params) do
    {
      pickup_address: {lat: 51.6, lng: -0.43, country_code: 'GB'},
      destination_address: {lat: 51.5, lng: -0.22},
      later: false,
      scheduled_at: Time.current + 2.hours
    }
  end

  describe '#execute' do
    context 'when succeeds' do
      let(:price_response) { Rails.root.join('spec/fixtures/gett/price_response.json').read }
      let(:response) { {status: 200, body: price_response} }
      let(:gett_eta_response) do
        double(execute: true, success?: true, response: gett_etas)
      end
      let(:via_eta_response) do
        double(execute: true, result: 10)
      end
      let(:gett_etas) do
        double(data: {
          etas: [
            { product_id: 'product1', eta: 100 },
            { product_id: 'product2', eta: 300 }
          ]
        })
      end

      before do
        allow(::Gett::Eta).to receive(:new).and_return(gett_eta_response)
        allow(gett_eta_response).to receive(:with_context).and_return(gett_eta_response)
        expect(::Gett::Via::Eta).to receive(:new).and_return(gett_eta_response)
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

        params = {
          pickup_latitude: 51.6,
          pickup_longitude: -0.43,
          destination_latitude: 51.5,
          destination_longitude: -0.22,
          business_id: 'TestBusinessId',
          scheduled_at: Time.current + 2.hours
        }
        stub_request(:get, "http://localhost/business/price?#{params.to_param}")
          .to_return(response)

        service.execute
      end

      it { is_expected.to be_success }
      its('response.data') { is_expected.to eq(JSON.parse(price_response)) }
    end
  end

  describe '#can_execute?' do
    context 'when cannot execute' do
      its(:can_execute?) { is_expected.to be true }

      context 'when allowed_services does not include carey' do
        subject(:service) { described_class.new(attrs: params, allowed_services: []) }
        its(:can_execute?) { is_expected.to be false }
      end
    end
  end
end
