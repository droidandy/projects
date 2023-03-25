require 'rails_helper'

RSpec.describe GoogleApi::ReverseGeocode, type: :service do
  subject(:service) { GoogleApi::ReverseGeocode.new(params) }

  describe '#execute' do
    describe 'reverse geocode request' do
      let(:lat) { 44.4647452 }
      let(:lng) { 7.3553838 }
      let(:params) { { lat: lat, lng: lng } }

      context 'when request succeeds' do
        let(:response_body) { Rails.root.join('spec/fixtures/google_api/reverse_geocode/postal_town_response.json').read }

        before do
          stub_request(:get, %r{https://maps.googleapis.com/maps/api/geocode/json})
            .to_return(status: 200, body: response_body)
          service.execute
        end

        it { is_expected.to be_success }
        its(:result) do
          is_expected.to eq(
            status: 'OK',
            country: 'Italy',
            country_code: 'IT',
            formatted_address: 'Via Pasubio, 34, 12025 Dronero CN, Italy',
            lat: 44.46481,
            lng: 7.355569999999999,
            postal_code: '12025',
            timezone: 'Europe/Rome',
            city: 'Postal Town',
            region: 'Piemonte',
            street_name: 'Via Pasubio',
            street_number: '34',
            point_of_interest: 'Dronero',
            place_id: 'ChIJ9X2GwQE-zRIRMqiTuJO0rbQ',
            airport_iata: nil
          )
        end

        context 'address without postal town but with locality' do
          let(:response_body) { Rails.root.join('spec/fixtures/google_api/reverse_geocode/locality_response.json').read }

          it { is_expected.to be_success }
          its(:result) do
            is_expected.to eq(
              status: 'OK',
              country: 'Italy',
              country_code: 'IT',
              formatted_address: 'Via Pasubio, 34, 12025 Dronero CN, Italy',
              lat: 44.46481,
              lng: 7.355569999999999,
              postal_code: '12025',
              timezone: 'Europe/Rome',
              city: 'Dronero',
              region: 'Piemonte',
              street_name: 'Via Pasubio',
              street_number: '34',
              point_of_interest: 'Dronero',
              place_id: 'ChIJ9X2GwQE-zRIRMqiTuJO0rbQ',
              airport_iata: nil
            )
          end
        end

        context 'address without postal town and locality' do
          let(:response_body) { Rails.root.join('spec/fixtures/google_api/reverse_geocode/admin_area_level_1_response.json').read }

          it { is_expected.to be_success }
          its(:result) do
            is_expected.to eq(
              status: 'OK',
              country: 'United States',
              country_code: 'US',
              formatted_address: '277 Bedford Avenue, Brooklyn, NY 11211, USA',
              lat: 40.714232,
              lng: -73.9612889,
              postal_code: '11211',
              timezone: 'America/New_York',
              city: 'New York',
              region: 'New York',
              street_name: 'Bedford Avenue',
              street_number: '277',
              point_of_interest: 'Williamsburg',
              place_id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
              airport_iata: nil
            )
          end
        end

        context 'when no results are found' do
          let(:response_body) { Rails.root.join('spec/fixtures/google_api/reverse_geocode/zero_results_response.json').read }

          it { is_expected.not_to be_success }
          its(:result) { is_expected.to be nil }
        end
      end

      context 'when request fails' do
        before do
          stub_request(:get, %r{https://maps.googleapis.com/maps/api/geocode/json})
            .to_return(status: 400, body: '')

          expect(Airbrake).to receive(:notify)
          expect(service).to receive(:log_request_error).and_call_original

          service.execute
        end

        it { is_expected.not_to be_success }
        its(:result) { is_expected.to be nil }
      end
    end
  end
end
