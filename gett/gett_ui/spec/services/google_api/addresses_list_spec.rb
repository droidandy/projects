require 'rails_helper'

RSpec.describe GoogleApi::AddressesList, type: :service do
  let(:query)  { '339 Euston Rd, Kings Cross, London NW1 3AD, UK' }
  let(:params) { { string: query } }
  let(:channel_name) { Settings.google_api.channel }

  subject(:service) { GoogleApi::AddressesList.new(params) }

  describe '#execute' do
    describe 'find_distance request' do
      context 'when service succeeds' do
        let(:response) { double(code: 200, body: response_body) }
        let(:response_body) { Rails.root.join('spec/fixtures/addresses_list_response.json').read }

        before do
          expect(RestClient).to receive(:get).and_return(response)
          service.execute
        end

        it { is_expected.to be_success }
        its(:result) do
          is_expected.to eq(
            list: [{
              id: "ChIJITmPqVBODWsRBtI6qe3Y_I0",
              text: "22-23 Pacific Highway, Mooney Mooney, New South Wales, Australia",
              types: ["street_address", "geocode"],
              google: true
            }, {
              id: "ChIJfZP7c6RZwokRZfa2-j5fTa0",
              text: "22 West 23rd Street, New York, NY, United States",
              types: ["street_address", "geocode"],
              google: true
            }, {
              id: "ChIJf9J28x-d4jARA482IUNzagY",
              text: "22/23 Phahonyothin Road Bangkok Thailand",
              types: ["street_address", "geocode"],
              google: true
            }, {
              id: "ChIJQ2CRTVmc4jARKbNMziH3jl0",
              text: "22/23 Vibhavadi Rangsit Road Bangkok Thailand",
              types: ["street_address", "geocode"],
              google: true
            }, {
              id: "ChIJv4U_0ZtewokRHdD62Jdrnq8",
              text: "22-23 Greene Avenue, Flushing, NY, United States",
              types: ["street_address", "geocode"],
              google: true
            }],
           status: "OK"
          )
        end
      end

      context 'when service fails' do
        let(:error) { RestClient::BadRequest.new }
        let(:error_response) { double(body: nil, code: 400) }

        before do
          allow(error).to receive(:response).and_return(error_response)
          expect(RestClient).to receive(:get).and_raise(error)
          expect(Airbrake).to receive(:notify)
          expect(service).to receive(:log_request_error).and_call_original

          service.execute
        end

        it { is_expected.not_to be_success }
        its(:result) { is_expected.to be nil }
      end
    end
  end

  describe '#url' do
    let(:query) { 'строка' }

    context 'without country filtering' do
      it 'encodes url' do
        stub_request(:get, %r(https://maps.googleapis.com/maps/api/place/autocomplete/json\?channel=#{channel_name}&components=&input=%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B0))
          .to_return(status: 200, body: '')

        service.execute
      end
    end

    context 'with country filtering' do
      let(:params) { { string: query, countries_filter: ['uk'] } }

      it 'encodes url' do
        stub_request(:get, %r(https://maps.googleapis.com/maps/api/place/autocomplete/json\?channel=#{channel_name}&components=country:uk&input=%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B0))
          .to_return(status: 200, body: '')

        service.execute
      end
    end
  end
end
