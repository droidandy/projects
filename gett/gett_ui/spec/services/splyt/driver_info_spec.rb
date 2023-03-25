require 'rails_helper'

RSpec.describe Splyt::DriverInfo do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking)        { create(:booking, :splyt, pickup_address: pickup_address, vehicle: vehicle) }
  let(:pickup_address) { create(:address, :baker_street) }
  let(:vehicle)        { create(:vehicle, :splyt) }
  let(:api_url)        { Settings.splyt.api_url }
  let(:url)            { "#{api_url}/v2/bookings/#{booking.service_id}/driver" }

  context 'driver assigned' do
    let(:response) do
      {
        'driver' => {
          'first_name'      => 'Sergey',
          'profile_picture' => 'photo.jpg',
          'phone_number'    => '+375293206566',
          'vehicle'         => {
            'model'         => 'Corolla',
            'make'          => 'Toyota',
            'license_plate' => '3310 BB-0',
            'location' => {
              'latitude'  => '1',
              'longitude' => '1',
              'bearing'   => '123'
            }
          }
        }
      }
    end

    before { stub_request(:get, url).to_return(status: 200, body: response.to_json) }

    describe '#execute' do
      it 'sends get request and returns driver info' do
        expect(service.execute.result.code).to eq(200)
        expect(service.execute.result.data).to eq(response)
      end
    end

    describe '#normalized_response' do
      let(:normalized_response) do
        {
          driver: {
            name:         'Sergey',
            image_url:    'photo.jpg',
            phone_number: '+375293206566',
            vehicle: {
              model:         'Toyota Corolla',
              license_plate: '3310 BB-0'
            },
            lat:         '1',
            lng:         '1',
            bearing:     '123',
            vendor_name: 'Splyt'
          }
        }
      end

      it 'maps response to new hash' do
        expect(service.execute.normalized_response).to eq(normalized_response)
      end
    end
  end

  context 'driver not assigned yet' do
    let(:response) do
      {
        'errno': 30103,
        'message': 'Not found',
        'description': 'Driver is not yet assigned'
      }
    end

    before { stub_request(:get, url).to_return(status: 404, body: response.to_json) }

    it 'does not throw an exception and returns empty driver info' do
      service.execute
      expect(service).to be_success
      expect(service.normalized_response).to eq(
        error_code: Splyt::DriverInfo::DRIVER_NOT_ASSIGNED_CODE,
        driver: { vendor_name: 'Splyt' }
      )
    end
  end
end
