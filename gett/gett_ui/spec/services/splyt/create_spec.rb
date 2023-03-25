require 'rails_helper'

RSpec.describe Splyt::Create do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking) do
    create(:booking, :splyt,
      pickup_address: pickup_address,
      destination_address: destination_address,
      vehicle: vehicle,
      quote_id: '1'
    )
  end
  let(:pickup_address)      { create(:address, :baker_street) }
  let(:destination_address) { create(:address, :mercedes_glasgow, postal_code: nil) }
  let(:vehicle)             { create(:vehicle, :splyt) }
  let(:api_url)             { Settings.splyt.api_url }

  describe '#execute' do
    let(:response) do
      {
        booking: {
          booking_id: '5b4e02f7351d8e061781bb2d',
          self_link: '/v2/bookings/5b4e02f7351d8e061781bb2d',
          metadata: {},
          created: '2018-07-17T14:53:43.763Z',
          updated: '2018-07-17T14:53:43.763Z',
          status: 'searching-for-driver',
          type: 'now',
          pickup: {
            latitude: 51.5242536,
            longitude: -0.1403077
          },
          dropoff: {
            latitude: 51.517297,
            longitude: -0.0823724
          },
          currency_code: 'GBP',
          configuration: {
            car_type: 'standard',
            payment_type: 'online'
          },
          passenger: {
            user_id: '35',
            first_name: 'Abe',
            phone_number: '+948-417-5835'
          }
        }
      }.to_json
    end

    let(:params) do
      {
        provider_id: booking.quote_id,
        region_id: 'qwe123',
        estimate_id: 'qwe123ewq',
        remote_booking_id: booking.order_id,
        currency_code: 'GBP',
        type: 'now',
        pickup: {
          latitude: booking.pickup_address.lat,
          longitude: booking.pickup_address.lng,
          address: {
            city: booking.pickup_address.city,
            postal_code: booking.pickup_address.postal_code,
            country: 'United Kingdom',
            street_name: booking.pickup_address.street_name,
            street_number: booking.pickup_address.street_number
          }
        },
        dropoff: {
          latitude: booking.destination_address.lat,
          longitude: booking.destination_address.lng,
          address: {
            city: booking.destination_address.city,
            country: 'United Kingdom',
            name: booking.destination_address.point_of_interest,
            street_name: booking.destination_address.street_name,
            street_number: booking.destination_address.street_number
          }
        },
        passenger: {
          user_id: booking.passenger.id.to_s,
          first_name: booking.passenger.first_name,
          phone_number: '+380995555555'
        },
        configuration: {
          car_type: 'Standard'
        }
      }
    end

    let(:url) { "#{api_url}/v2/bookings" }

    before { stub_request(:post, url).to_return(status: 200, body: response) }

    it 'sends post request and returns an booking' do
      expect(service.execute.result.body).to eq(response)
    end

    it 'calls post method with params' do
      expect(service).to receive(:post).with(url, params)

      service.execute
    end

    context 'when booking is in future' do
      let(:booking) { create(:booking, :splyt, :scheduled, pickup_address: pickup_address, destination_address: destination_address, vehicle: vehicle, quote_id: '1') }
      let(:params) do
        {
          provider_id: booking.quote_id,
          region_id: 'qwe123',
          estimate_id: 'qwe123ewq',
          remote_booking_id: booking.order_id,
          currency_code: 'GBP',
          type: 'future',
          pickup: {
            latitude: booking.pickup_address.lat,
            longitude: booking.pickup_address.lng,
            address: {
              city: booking.pickup_address.city,
              postal_code: booking.pickup_address.postal_code,
              country: 'United Kingdom',
              street_name: booking.pickup_address.street_name,
              street_number: booking.pickup_address.street_number
            }
          },
          dropoff: {
            latitude: booking.destination_address.lat,
            longitude: booking.destination_address.lng,
            address: {
              city: booking.destination_address.city,
              country: 'United Kingdom',
              name: booking.destination_address.point_of_interest,
              street_name: booking.destination_address.street_name,
              street_number: booking.destination_address.street_number
            }
          },
          passenger: {
            user_id: booking.passenger.id.to_s,
            first_name: booking.passenger.full_name,
            phone_number: '+380995555555'
          },
          configuration: {
            car_type: 'Standard',
            departure_date: booking.scheduled_at.in_time_zone(booking.timezone).iso8601
          }
        }
      end

      it 'set full name in request params' do
        expect(service).to receive(:post).with(url, params)

        service.execute
      end
    end

    context 'when there is a guest user' do
      let(:booking) do
        create(
          :booking,
          :splyt,
          :without_passenger,
          pickup_address:       pickup_address,
          destination_address:  destination_address,
          vehicle:              vehicle,
          quote_id:             '1',
          passenger_first_name: 'Sergey',
          passenger_phone:      '+375293206447'
        )
      end

      let(:params) do
        {
          provider_id: booking.quote_id,
          region_id: 'qwe123',
          estimate_id: 'qwe123ewq',
          remote_booking_id: booking.order_id,
          currency_code: 'GBP',
          type: 'now',
          pickup: {
            latitude: booking.pickup_address.lat,
            longitude: booking.pickup_address.lng,
            address: {
              city: booking.pickup_address.city,
              country: 'United Kingdom',
              postal_code: booking.pickup_address.postal_code,
              street_name: booking.pickup_address.street_name,
              street_number: booking.pickup_address.street_number
            }
          },
          dropoff: {
            latitude: booking.destination_address.lat,
            longitude: booking.destination_address.lng,
            address: {
              city: booking.destination_address.city,
              country: 'United Kingdom',
              name: booking.destination_address.point_of_interest,
              street_name: booking.destination_address.street_name,
              street_number: booking.destination_address.street_number
            }
          },
          passenger: {
            user_id: user_id,
            first_name: 'Sergey',
            phone_number: '+375293206447'
          },
          configuration: {
            car_type: 'Standard'
          }
        }
      end

      let(:user_id) { 'user-id' }

      it 'generates user id with SecureRandom' do
        expect(SecureRandom).to receive(:uuid).and_return(user_id)
        expect(service).to      receive(:post).with(url, params)

        service.execute
      end
    end

    context 'when city is missing in pickup of destination address' do
      let(:pickup_address)      { create(:address, :baker_street, city: nil) }
      let(:destination_address) { create(:address, :mercedes_glasgow, city: nil, postal_code: nil) }

      let(:params) do
        super().deep_merge(
          pickup: {
            address: {
              city: ','
            }
          },
          dropoff: {
            address: {
              city: ','
            }
          }
        )
      end

      it 'puts comma as city name' do
        expect(service).to receive(:post).with(url, params)

        service.execute
      end
    end

    describe '#normalized_response' do
      it 'returns a hash with service_id' do
        service.execute

        expect(service.normalized_response).to eq(service_id: '5b4e02f7351d8e061781bb2d')
      end
    end
  end
end
