require 'rails_helper'

RSpec.describe Gett::Eta, type: :service do
  subject(:service) { described_class.new(attributes) }

  service_context { { company: create(:company) } }

  describe '#execute' do
    let(:attributes) do
      {
        lat: 51.6,
        lng: -0.43
      }
    end

    context 'when succeeds' do
      let(:eta_response) { Rails.root.join('spec/fixtures/gett/eta_response.json').read }
      let(:response) { {status: 200, body: eta_response} }
      let(:expected_business_id) { 'TestBusinessId' }

      before do
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))
        expect(expected_business_id).to be_present

        params = {
          latitude: 51.6,
          longitude: -0.43,
          business_id: expected_business_id
        }
        stub_request(:get, "http://localhost/business/eta?#{params.to_param}")
          .to_return(response)

        service.execute
      end

      it { is_expected.to be_success }
      its('response.data') { is_expected.to eq(JSON.parse(eta_response)) }

      context 'when ETA is for RU location' do
        let(:attributes) { super().merge(country_code: 'RU') }
        let(:expected_business_id) { Settings.gt.ru_business_id }

        it { is_expected.to be_success }
      end
    end
  end
end
