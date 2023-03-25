require 'rails_helper'

RSpec.describe Mobile::V1::Bookings::Create, type: :service do
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0 }))
  end

  before { allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub) }

  let(:company) { create(:company, name: 'LEGO') }
  let(:admin)   { create(:admin, company: company) }

  subject(:service) { described_class.new(params: params) }

  service_context { { company: company, user: admin } }

  describe '#execute' do
    stub_channelling!
    before do
      allow(BookingsServiceJob).to receive(:perform_later)
        .with(instance_of(Booking), 'Bookings::CreateRequest')
      allow(Faye.bookings).to receive(:notify_create)
      allow(Alerts::FlightChecker).to receive_message_chain(:new, :execute)
      create(:vehicle, :gett, value: 'product')
    end

    context 'with valid params' do
      let(:vehicle) { create(:vehicle, :gett) }
      let(:travel_reason) { create(:travel_reason, company: admin.company) }
      let(:passenger_name) { nil }
      let(:params) do
        {
          vehicle_value: vehicle.value,
          message: 'Some message',
          passenger_name: passenger_name,
          passenger_phone: '+79998886655',
          international_flag: true,
          travel_reason_id: travel_reason.id,
          scheduled_at: (90.minutes.from_now).to_s,
          payment_method: 'account',
          pickup_address: { postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup', country_code: 'GB', city: 'London' },
          destination_address: { postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown', country_code: 'GB', city: 'London' },
          stops: [
            {
              name: 'Bob',
              phone: '777888666555',
              address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point', country_code: 'GB', city: 'London' }
            }
          ],
          vehicle_price: 1000,
          as_directed: false
        }
      end

      context 'source_type is not present in params' do
        it 'sets proper source type' do
          service.execute
          expect(service.booking.source_type).to eq('mobile_app')
        end
      end

      context 'source_type is present in params' do
        before { params[:source_type] = 'web' }

        it 'sets proper source type' do
          service.execute
          expect(service.booking.source_type).to eq('mobile_app')
        end
      end
    end
  end
end
