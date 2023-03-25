require 'rails_helper'

RSpec.describe GoogleApi::Directions, type: :service do
  let(:params) do
    {
      origin: origin_params,
      destination: destination_params,
      waypoints: waypoints_params
    }
  end
  let(:origin_params) { [0.513, 63.987] }
  let(:destination_params) { [0.123, 68.538] }
  let(:waypoints_params) { [[51.577, -0.197], [51.559, -0.196], [51.554, -0.196]] }
  let(:channel_name) { Settings.google_api.channel }
  let(:open_key) { Settings.google_api.open_key }

  let(:params_string) do
    "channel=#{channel_name}&destination%5B%5D=0.123&destination%5B%5D=68.538&key=#{open_key}&language=en&origin%5B%5D=0.513&origin%5B%5D=63.987&waypoints=%5B51.577,%20-0.197%5D%7C%5B51.559,%20-0.196%5D%7C%5B51.554,%20-0.196%5D"
  end

  subject(:service) { described_class.new(params) }

  describe '#execute' do
    describe 'directions request' do
      context 'when service succeeds' do
        before do
          stub_request(:get, "https://maps.googleapis.com/maps/api/directions/json?#{params_string}")
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/google_api/directions_response.json').read)

          service.execute
        end

        it { is_expected.to be_success }

        its(:result) do
          is_expected.to eq(
            direction: "}viyHbjV[lZA|@i@SMCc@Gi@CcHeA_I}AuD}@cBk@o@a@KDYVGJIv@Kz@OrAIVe@vEOrASEMCGBGH",
            status: 'OK'
          )
        end
      end

      context 'when service fails' do
        before do
          expect(Airbrake).to receive(:notify)
          expect(service).to receive(:log_request_error).and_call_original

          stub_request(:get, "https://maps.googleapis.com/maps/api/directions/json?#{params_string}")
            .to_return(status: 400, body: {error: :some_error}.to_json)

          service.execute
        end

        it { is_expected.not_to be_success }
        its(:result) { is_expected.to be false }
      end
    end
  end
end
