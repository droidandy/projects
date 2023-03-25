require 'rails_helper'

RSpec.describe GoogleApi::FindDistance, type: :service do
  let(:params) do
    {
      origin: origin_params,
      destination: destination_params
    }
  end
  let(:origin_params) { [0.513, 63.987] }
  let(:destination_params) { [0.123, 68.538] }
  let(:response) { double(code: 200, body: response_body) }
  let(:response_body) { Rails.root.join('spec/fixtures/distance_response_in_miles.json').read }

  subject(:service) { described_class.new(params) }

  describe '#distance_in_miles' do
    context 'execute was not called before' do
      subject { service.distance_in_miles }

      it { expect(subject).to be_falsey }
    end

    context 'execute was called before' do
      subject do
        expect(RestClient).to receive(:get).and_return(response)
        service.execute
        service.distance_in_miles
      end

      it { expect(subject).to be_truthy }
    end
  end

  describe '#execute' do
    describe 'find_distance request' do
      context 'when service succeeds' do
        before do
          expect(RestClient).to receive(:get).and_return(response)
          service.execute
        end

        it { is_expected.to be_success }

        context 'when distance in miles' do
          its(:result) do
            is_expected.to include(
              distance: 4.6,
              distance_measure: "miles",
              duration_sec: "1864",
              duration_measure: "minutes",
              success: true,
              status: "OK"
            )
          end
        end

        context 'when distance in feet' do
          let(:response_body) { Rails.root.join('spec/fixtures/distance_response_in_feet.json').read }

          its(:result) do
            is_expected.to include(
              distance: 465.0,
              distance_measure: "feet",
              duration_sec: "1864",
              duration_measure: "minutes",
              success: true,
              status: "OK"
            )
          end
        end
      end

      context 'when service fails' do
        let(:error) { RestClient::BadRequest.new }
        let(:error_response) { double(body: {error: :some_error}.to_json, code: 400) }

        before do
          allow(error).to receive(:response).and_return(error_response)
          expect(RestClient).to receive(:get).and_raise(error)
          expect(Airbrake).to receive(:notify)
          expect(service).to receive(:log_request_error).and_call_original

          service.execute
        end

        it { is_expected.not_to be_success }
        its(:result) { is_expected.to be false }
      end
    end
  end
end
