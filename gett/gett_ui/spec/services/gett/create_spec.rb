require 'rails_helper'

RSpec.describe Gett::Create, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    let(:country_code) { 'UK' }
    let(:pickup_address) { create(:address, :baker_street, country_code: country_code) }
    let(:vehicle) { create(:vehicle, :gett) }
    let(:booking) do
      create(:booking, :scheduled,
        pickup_address: pickup_address,
        vehicle: vehicle,
        scheduled_at: 2.hours.from_now,
        passenger: create(:passenger, phone: '+07122989899')
      )
    end

    let(:stop_address) { create(:address) }

    before do
      booking.add_booking_address(
        address_id: stop_address.id,
        address_type: 'stop',
        stop_info: { name: 'Bob', phone: '+79998887766' }
      )
    end

    context 'when succeeds' do
      let(:ride_response) do
        {
          "ride_id"        => "0417711045",
          "status"         => "Pending",
          "product_id"     => "cfd8290c-d267-4bfb-8961-ea7ae39cf5a9",
          "pickup"         => {"latitude" => 51.61, "longitude" => -0.27, "address" => "Address Line"},
          "destination"    => {"latitude" => 51.57, "longitude" => -0.21, "address" => "Address Line"},
          "rider"          => {"name" => "Some Name", "phone_number" => "972501234567"},
          "note_to_driver" => "Some note",
          "stop_points"    => [
            {"latitude" => 51.52, "longitude" => -0.21, "address" => "Address Line", "phone_number" => ""}
          ],
          "requested_at"   => "",
          "scheduled_at"   => "2017-04-20T13:16:59Z"
        }
      end
      let(:response)          { {status: 200, body: ride_response.to_json} }
      let(:expected_response) { {service_id: '0417711045'} }

      before do
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

        expect(service).to receive(:params).and_return(double(to_json: 'params'))

        stub_request(:post, 'http://localhost/business/rides?business_id=TestBusinessId')
          .with(body: 'params')
          .to_return(response)

        service.execute
      end

      it { is_expected.to be_success }
      its(:normalized_response) { is_expected.to eq expected_response }
    end

    specify '#params' do
      expect(service.send(:params)).to match(
        pickup: {
          latitude: pickup_address.lat,
          longitude: pickup_address.lng,
          address: pickup_address.line
        },
        destination: {
          latitude: booking.destination_address.lat,
          longitude: booking.destination_address.lng,
          address: booking.destination_address.line
        },
        rider: {
          name: booking.passenger.full_name,
          phone_number: booking.passenger.phone
        },
        note_to_driver: 'Some message',
        payment_type: 'voucher',
        product_id: 'product1',
        reference: booking.id.to_s,
        scheduled_at: booking.scheduled_at,
        stop_points: [
          {
            latitude: stop_address.lat,
            longitude: stop_address.lng,
            address: stop_address.line,
            name: 'Bob',
            phone_number: '+79998887766'
          }
        ]
      )
    end

    specify '#params for affiliate company' do
      booking.booker.company.update(company_type: :affiliate)
      booking.update(payment_method: 'cash')

      expect(service.send(:params)).to match(
        pickup: {
          latitude: booking.pickup_address.lat,
          longitude: booking.pickup_address.lng,
          address: booking.pickup_address.line
        },
        destination: {
          latitude: booking.destination_address.lat,
          longitude: booking.destination_address.lng,
          address: booking.destination_address.line
        },
        rider: {
          name: booking.passenger.full_name,
          phone_number: booking.passenger.phone
        },
        note_to_driver: 'Some message',
        product_id: 'product1',
        reference: booking.id.to_s,
        scheduled_at: booking.scheduled_at,
        stop_points: [
          {
            latitude: stop_address.lat,
            longitude: stop_address.lng,
            address: stop_address.line,
            name: 'Bob',
            phone_number: '+79998887766'
          }
        ],
        payment_type: 'cash'
      )
    end

    context 'when affiliate company payment type is not cash' do
      specify '#params' do
        booking.booker.company.update(company_type: :affiliate)
        booking.update(payment_method: 'account')
        expect(service.send(:params)).to include(payment_type: 'cash')
      end
    end

    context 'when payment type is neither account nor cash' do
      specify '#params' do
        booking.update(payment_method: 'company_payment_card')
        expect(service.send(:params)).to include(payment_type: 'voucher')
      end
    end

    context 'Gett RU request' do
      let(:country_code) { 'RU' }

      specify '#params[:rider][:phone_number]' do
        expect(service.send(:params)[:rider]).to include(phone_number: '447122989899')
      end
    end

    context 'Gett IL request' do
      let(:country_code) { 'IL' }

      specify '#params[:rider][:phone_number]' do
        expect(service.send(:params)[:rider]).to include(phone_number: '447122989899')
      end
    end

    context 'Gett UK request with GB country code' do
      let(:country_code) { 'GB' }

      specify '#params[:rider][:phone_number]' do
        expect(service.send(:params)[:rider]).to include(phone_number: '+07122989899')
      end
    end
  end
end
