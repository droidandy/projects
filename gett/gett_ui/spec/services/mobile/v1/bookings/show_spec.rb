require 'rails_helper'

RSpec.describe Mobile::V1::Bookings::Show, type: :service do
  it { is_expected.to be_authorized_by(Bookings::ShowPolicy) }

  describe '#execute' do
    let(:airport) { create(:airport, iata: 'JFK') }
    let(:address) { create(:address, airport: airport) }
    let(:booking) do
      create(:booking,
        pickup_address: create(:address, line: 'Line 1', lat: 1.0, lng: 2.0, postal_code: 'Code 1', country_code: 'GB', timezone: 'Europe/London', city: 'City 1'),
        destination_address: create(:address, line: 'Line 2', lat: 1.0, lng: 2.0, postal_code: 'Code 2', country_code: 'UA', timezone: 'Europe/Kiev', city: 'City 2'),
        stop_addresses: [address])
    end
    let(:service) { described_class.new(booking: booking) }

    subject { service.execute.result.with_indifferent_access }

    it {
      is_expected.to include(
        :id, :service_id, :message, :flight, :status, :payment_method, :scheduled_at,
        :service_type, :message_to_driver, :passenger, :passenger_avatar_url, :phone,
        :pickup_address, :destination_address, :stop_addresses, :vehicle_type, :booker,
        :travel_reason, :references, :channel, :final, :driver_details, :can, :path, :events,
        :booker_phone, :travel_distance, :rateable, :recurring_next, :cancellation_reasons,
        :rating_reasons, :otp_code
      )
    }

    describe '[:service_id]' do
      let(:booking) { create(:booking, :splyt, service_id: '123aa456') }

      its([:service_id]) { is_expected.to eq("SP#{booking.id}") }
    end

    describe '[:destination_address]' do
      its([:destination_address]) do
        is_expected.to match(hash_including(
          'line' => 'Line 2',
          'lat' => 1.0,
          'lng' => 2.0,
          'airport' => nil,
          'postal_code' => 'Code 2',
          'country_code' => 'UA',
          'timezone' => 'Europe/Kiev',
          'city' => 'City 2'
        ))
      end
    end

    describe '[:pickup_address]' do
      its([:pickup_address]) do
        is_expected.to match(hash_including(
          'line' => 'Line 1',
          'lat' => 1.0,
          'lng' => 2.0,
          'airport' => nil,
          'postal_code' => 'Code 1',
          'country_code' => 'GB',
          'timezone' => 'Europe/London',
          'city' => 'City 1'
        ))
      end
    end

    describe '[:stop_addresses]' do
      its([:stop_addresses]) do
        is_expected.to eq([
          'line' => address.line,
          'lat' => address.lat,
          'lng' => address.lng,
          'airport' => airport.iata,
          'postal_code' => address.postal_code,
          'country_code' => address.country_code,
          'timezone' => address.timezone,
          'city' => address.city,
          'name' => nil,
          'phone' => nil
        ])
      end
    end
  end
end
