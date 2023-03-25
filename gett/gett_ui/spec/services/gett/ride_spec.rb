require 'rails_helper'

RSpec.describe Gett::Ride, type: :service do
  let(:booking)       { create(:booking, service_id: '1136508172') }
  let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_routing.json').read }
  let(:response)      { {status: 200, body: response_body} }
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0 }))
  end

  subject(:service) { Gett::Ride.new(booking: booking) }

  service_context { { company: create(:company) } }

  describe '#execute' do
    context 'company from UK' do
      before do
        allow(booking).to receive(:pickup_address).and_return(double(country_code: 'UK'))

        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

        stub_request(:get, "http://localhost/business/rides/#{booking.service_id}?business_id=TestBusinessId")
          .to_return(response)

        allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub)

        service.execute
      end

      it { is_expected.to be_success }

      describe '#normalized_response' do
        subject { service.normalized_response }

        context 'when there is no driver info' do
          it do
            is_expected.to eq(
              status: 'Routing',
              driver: {
                pickup_lat: 51.5172821,
                pickup_lng: -0.0823385999999573,
                vendor_name: 'Gett'
              }
            )
          end
        end

        context 'with driver info' do
          let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_complete.json').read }

          its([:driver]) { is_expected.to include(:name, :image_url, :phone_number, :rating, :vehicle, :lat, :lng, :bearing) }
        end

        context 'with driver location (0, 0)' do
          let(:response_body) do
            resp = JSON.parse(Rails.root.join('spec/fixtures/gett/ride_response_complete.json').read)
            resp['driver']['location'] = { 'latitude' => 0, 'longitude' => 0 }
            resp.to_json
          end

          its([:driver]) { is_expected.to include :name, :image_url, :phone_number, :rating, :vehicle }
          its([:driver, :lat]) { is_expected.to be_nil }
          its([:driver, :lng]) { is_expected.to be_nil }
        end

        context 'with will_arrive_at in past' do
          let(:response_body) do
            resp = JSON.parse(Rails.root.join('spec/fixtures/gett/ride_response_complete.json').read)
            resp['will_arrive_at'] = (Time.current - 1.hour).strftime('%Y-%m-%dT%H:%M:%SZ')
            resp.to_json
          end

          its([:driver, :will_arrive_at]) { is_expected.to be_present }
          its([:driver, :eta]) { is_expected.to eq 0 }
        end
      end
    end

    context 'company from Israel' do
      before do
        allow(booking).to receive(:pickup_address).and_return(double(country_code: 'IL'))
      end

      it 'sends request with IL bisiness id' do
        allow(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

        stub_request(:get, "http://localhost/business/rides/#{booking.service_id}?business_id=IL-1234")
          .to_return(response)

        expect(service.execute).to be_success
      end
    end
  end
end
