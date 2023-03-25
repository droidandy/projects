require 'rails_helper'

RSpec.describe GoogleApi::NearbySearch, type: :service do
  let(:params) do
    {
      location: '1,2',
      type: 'airport',
      rankby: 'distance',
      name: 'airport'
    }
  end

  subject(:service) { described_class.new(params) }

  describe '#execute' do
    context 'when service succeeds' do
      let(:response) { double(code: 200, body: response_body) }
      let(:response_body) { Rails.root.join('spec/fixtures/google_api/nearbysearch_response.json').read }

      before do
        expect(RestClient).to receive(:get).and_return(response)
        service.execute
      end

      it { is_expected.to be_success }
      its(:result) do
        {
          list: [
            { id: "ChIJJUyxFNIEdkgRajb-0tlYT_0",
              text: "Premier Inn London Leicester Square",
              types: ["lodging", "restaurant", "food", "point_of_interest", "establishment"] },
            { id: "ChIJZewrLtIEdkgRtl2nZKboAgk",
              text: "Thistle Piccadilly Hotel",
              types: ["bar", "lodging", "restaurant", "food", "point_of_interest", "establishment"] },
            { id: "ChIJa02JOs0EdkgRYMpqzoQ-qNI",
              text: "Radisson Blu Edwardian, Mercer Street",
              types: ["lodging", "restaurant", "food", "point_of_interest", "establishment"] }
          ],
          status: "OK",
          next_page_token: JSON.parse(response_body)['next_page_token']
        }
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
