require 'rails_helper'

RSpec.describe ::Gett::Via::Eta, type: :service do
  describe '#execute' do
    let(:pickup_address) do
      {
        city: 'Slough',
        postal_code: 'SL2 5FQ',
        lat: 51.5125344,
        lng: -0.5903784,
        region: 'England',
        line: '28 Railway Terrace, Slough SL2 5FQ, UK'
      }
    end
    let(:destination_address) do
      {
        city: 'Amersham',
        postal_code: 'HP6 5AE',
        lat: 51.6756868,
        lng: -0.6037618,
        region: 'England',
        line: '9 Chiltern Ave, Amersham HP6 5AE, UK'
      }
    end
    let(:params) do
      {
        origin: {
          city: 'Slough',
          postal_code: 'SL2 5FQ',
          lat: 51.5125344,
          lng: -0.5903784,
          state: 'England',
          address: '28 Railway Terrace, Slough SL2 5FQ, UK',
          country: '',
          description: ''
        }.to_json,
        destination: {
          city: 'Amersham',
          postal_code: 'HP6 5AE',
          lat: 51.6756868,
          lng: -0.6037618,
          state: 'England',
          address: '9 Chiltern Ave, Amersham HP6 5AE, UK',
          country: '',
          description: ''
        }.to_json
      }
    end
    let(:body) do
      {
        service_available: true,
        trip_quotes: [
          {pickup_eta_max: Time.now.to_i + 60},
          {pickup_eta_max: Time.now.to_i + 182},
          {pickup_eta_max: Time.now.to_i + 130}
        ]
      }.to_json
    end

    before do
      allow(Settings.via).to receive(:api_url).and_return('http://localhost')
      allow(::Gett::Via::AuthToken).to receive_message_chain(:new, :execute, :result)
      stub_request(:get, "http://localhost/trips/quote?#{params.to_param}")
        .to_return(status: 200, body: body)
    end

    describe '#execute' do
      subject(:service) { described_class.new(pickup_address: pickup_address, destination_address: destination_address) }

      it 'should return maximum of available ETAs in minutes' do
        expect(service.execute.result).to eq(3)
      end
    end
  end
end
