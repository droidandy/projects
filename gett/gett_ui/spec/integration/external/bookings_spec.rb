require 'swagger_helper'

describe 'External Bookings API', swagger_doc: 'external/swagger.json' do
  let(:admin)       { create(:companyadmin) }
  let(:vehicle)     { create(:vehicle, :gett) }
  let(:'X-Api-Key') { ApiKey.create(user: admin).key }
  let(:body)        { JSON.parse(response.body, symbolize_names: true) }

  before do
    # Google API find distance requests
    stub_request(:get, %r(https://maps.googleapis.com/maps/api/distancematrix))
      .to_return(status: 200, body: Rails.root.join('spec/fixtures/distance_response_in_miles.json').read)

    # Google API reverse gocoding requests on pickup, destination and stop addresses
    stub_request(:get, %r(https://maps.googleapis.com/maps/api/geocode/json?.*latlng=[\-\d\.]+,[\-\d\.]+.*))
      .to_return(status: 200, body: Rails.root.join('spec/fixtures/google_api/reverse_geocode/admin_area_level_1_response.json').read)

    # Gett authentication requests
    stub_request(:post, %r(http://localhost/oauth/token?.+scope=business))
      .to_return(status: 200, body: {'created_at' => Time.current.to_i, 'expires_in' => 1000}.to_json)

    allow(Faye.bookings).to receive(:notify_create)
    allow(Faye.bookings).to receive(:notify_update)
  end

  let(:booking) do
    {
      vehicle_value:    vehicle.value,
      message:          'Some New message',
      passenger_name:   'Petr Ivanov',
      passenger_phone:  '+79998886655',
      travel_reason_id: 'travel_reason_id',
      scheduled_at:     90.minutes.from_now.to_s,
      vehicle_count:    '2',
      payment_method:   'cash',
      vehicle_price:    1000,
      pickup_address: {
        postal_code:  'NW11 9UA',
        lat:          '51.5766877',
        lng:          '-0.2156368',
        line:         'Pickup',
        country_code: 'GB',
        city:         'London'
      },
      destination_address: {
        postal_code:  'HA8 6EY',
        lat:          '51.6069082',
        lng:          '-0.2816665',
        line:         'Setdown',
        country_code: 'GB',
        city:         'London'
      },
      stops: [{
        name:  'Petr',
        phone: '+79998886655',
        address: {
          postal_code:  'NW9 5LL',
          lat:          '51.6039763',
          lng:          '-0.2705515',
          line:         'Stop point',
          country_code: 'GB',
          city:         'London'
        }
      }]
    }
  end

  path '/bookings' do
    get 'List bookings' do
      produces 'application/json'
      security [ api_key: [] ]
      parameter name: :page, in: :query, type: :string

      response '200', 'returns bookings list' do
        let(:page) { '1' }

        before { create(:booking, booker: admin) }

        schema(
          type: :object,
          properties: {
            items: {
              type: :array,
              items: {'$ref' => '#/definitions/booking_data_schema'}
            },
            pagination: {
              type: :object,
              properties: {
                current:   {type: :number},
                total:     {type: :number},
                page_size: {type: :number}
              },
              required: ['current', 'total', 'page_size']
            }
          },
          required: ['items']
        )

        run_test! do
          expect(body[:items]).to be_present
          expect(body[:pagination]).to be_present
        end
      end
    end

    post 'Create a booking' do
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :booking, in: :body, schema: {'$ref' => '#/definitions/booking_params_schema'}

      response '200', 'booking created' do
        schema('$ref' => '#/definitions/booking_data_schema')

        run_test!
      end
    end
  end

  path '/bookings/{booking_id}' do
    parameter name: :booking_id, in: :path, type: :number

    get 'Get booking' do
      produces 'application/json'
      security [ api_key: [] ]

      response '200', 'Booking' do
        let!(:booking_id) { create(:booking, booker: admin).id }

        schema('$ref' => '#/definitions/booking_data_schema')

        run_test!
      end
    end

    put 'Update booking' do
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :booking, in: :body, schema: {'$ref' => '#/definitions/booking_params_params'}

      response '200', 'booking updated' do
        before do
          stub_request(:patch, "http://localhost/business/rides/service-id?business_id=TestBusinessId")
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/gett/ride_response_modify.json').read)
        end

        let!(:booking_id) { create(:booking, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

        schema('$ref' => '#/definitions/booking_data_schema')

        run_test! do
          expect(Faye.bookings).to have_received(:notify_update)
        end
      end

      context 'with master token authorization' do
        let(:back_office_user) { create(:user, :admin) }
        let(:'X-Api-Key') { create(:api_key, user: back_office_user).key }

        response '200', 'booking updated' do
          before do
            stub_request(:patch, "http://localhost/business/rides/service-id?business_id=TestBusinessId")
              .to_return(status: 200, body: Rails.root.join('spec/fixtures/gett/ride_response_modify.json').read)
          end

          let!(:booking_id) { create(:booking, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

          schema('$ref' => '#/definitions/booking_data_schema')

          run_test! do
            expect(Faye.bookings).to have_received(:notify_update)
          end
        end
      end

      response '422', 'booking not modifiable' do
        let!(:booking_id) { create(:booking, :asap, booker: admin).id }

        schema('$ref' => '#/definitions/errors_object')

        run_test! do
          expect(body).to eql(errors: 'Booking can no longer be modified')
          expect(Faye.bookings).not_to have_received(:notify_update)
        end
      end

      response '503', 'booking not updated due to service provider error' do
        let!(:booking_id) { create(:booking, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

        before do
          stub_request(:patch, "http://localhost/business/rides/service-id?business_id=TestBusinessId")
            .to_timeout
        end

        schema('$ref' => '#/definitions/errors_object')

        run_test! do
          expect(body).to eql(errors: 'Cannot modify booking via Gett API')
          expect(Faye.bookings).not_to have_received(:notify_update)
        end
      end
    end
  end

  path '/bookings/{booking_id}/cancel' do
    parameter name: :booking_id, in: :path, type: :number

    put 'Cancel booking' do
      produces 'application/json'
      security [ api_key: [] ]

      response '200', 'in status "creating"' do
        let!(:booking_id) { create(:booking, :creating, service_id: nil, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

        schema('$ref' => '#/definitions/booking_data_schema')

        run_test! do
          expect(body).to include(id: booking_id, status: 'cancelled')

          expect(Faye.bookings).not_to have_received(:notify_update)
        end
      end

      response '200', 'booking cancelled' do
        let!(:booking_id) { create(:booking, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

        before do
          allow(Faye).to receive(:notify).and_return(true)
          stub_request(:post, %r(http://localhost/business/rides/service-id/cancel)).to_return(status: 200, body: "")
        end

        schema('$ref' => '#/definitions/booking_data_schema')

        run_test! do
          expect(body).to include(id: booking_id, status: 'cancelled')

          expect(Faye.bookings).to have_received(:notify_update)
        end
      end

      context 'with master token authorization' do
        let(:back_office_user) { create(:user, :admin) }
        let(:'X-Api-Key') { create(:api_key, user: back_office_user).key }

        response '200', 'booking cancelled' do
          let!(:booking_id) { create(:booking, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

          before do
            allow(Faye).to receive(:notify).and_return(true)
            stub_request(:post, %r(http://localhost/business/rides/service-id/cancel)).to_return(status: 200, body: "")
          end

          schema('$ref' => '#/definitions/booking_data_schema')

          run_test! do
            expect(body).to include(id: booking_id, status: 'cancelled')

            expect(Faye.bookings).to have_received(:notify_update)
          end
        end
      end

      response '422', 'booking not cancelled due to uncancellable status' do
        let!(:booking_id) { create(:booking, :in_progress, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

        schema('$ref' => '#/definitions/errors_object')

        run_test! do
          expect(body).to eql(errors: nil)

          expect(Faye.bookings).not_to have_received(:notify_update)
        end
      end

      response '503', 'booking not cancelled due to service provider error' do
        let!(:booking_id) { create(:booking, booker: admin, scheduled_at: 1.hour.from_now, asap: false).id }

        before do
          stub_request(:post, %r(http://localhost/business/rides/service-id/cancel))
            .to_timeout
        end

        schema('$ref' => '#/definitions/errors_object')

        run_test! do
          expect(body).to eql(errors: 'Cannot cancel booking via Gett API')

          expect(Faye.bookings).not_to have_received(:notify_update)
        end
      end
    end
  end

  path '/bookings/vehicles' do
    let(:vehicles) do
      {
        passenger_name:  'Hosea Tillman',
        passenger_phone: '+7999888776655',
        scheduled_at:    1.hour.from_now.to_s,
        pickup_address: {
          postal_code:  'NW11 9UA',
          lat:          '51.5766877',
          lng:          '-0.2156368',
          line:         '3 Station Approach Highfield Avenue London',
          city:         'London',
          country_code: 'GB',
          timezone:     'Europe/London'
        },
        destination_address: {
          postal_code:  'HA8 6EY',
          lat:          '51.6069082',
          lng:          '-0.2816665',
          line:         '1 Milford Gardens Edgware',
          city:         'London',
          country_code: 'GB'
        },
        stops: [{
          name:  'Petr',
          phone: '+79998886655',
          address: {
            postal_code:  'NW9 5LL',
            lat:          '51.6039763',
            lng:          '-0.2705515',
            line:         'Stop point',
            country_code: 'GB',
            city:         'London'
          }
        }]
      }
    end

    post 'Vehicles and quotas' do
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :vehicles, in: :body, schema: {
        type: :object,
        properties: {
          pickup_address:      {'$ref' => '#/definitions/address_schema'},
          destination_address: {'$ref' => '#/definitions/address_schema'},
          scheduled_at:        {type: :datetime},
          passenger_name:      {type: :string},
          passenger_phone:     {type: :string},
          stops: {
            type: :array,
            items: {
              type: :object,
              properties: {
                name:    {type: :string},
                phone:   {type: :string},
                address: {'$ref' => '#/definitions/address_schema'}
              }
            }
          }
        },
        required: ['passenger_name', 'passenger_phone', 'pickup_address', 'destination_address']
      }

      response '200', 'returns vehicle and quota list' do
        before do
          allow(Faye).to receive(:notify).and_return(true)
          stub_request(:get, %r(http://localhost/business/eta))
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/gett/eta_response.json').read)

          stub_request(:get, %r(http://localhost/business/price))
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/gett/price_response.json').read)

          stub_request(:get, %r(http://localhost/ot)).to_timeout

          stub_request(:get, %r(https:///localhost/splyt/v2/providers/now))
            .to_return(status: 200, body: { providers: [] }.to_json)
          stub_request(:get, %r(https://localhost/splyt/v2/providers/future))
            .to_return(status: 200, body: { providers: [] }.to_json)
        end

        schema(
          type: :object,
          properties: {
            distance: {type: :string},
            duration: {type: :string},
            international_flag: {type: :boolean},
            vehicles: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  earliest_available_in: {type: :number},
                  service_type: {type: :string},
                  available:    {type: :boolean},
                  eta:          {type: [:number, :string, :null]},
                  name:         {type: :string},
                  price:        {type: :number, 'x-nullable': true},
                  value:        {type: :string, 'x-nullable': true},
                  reason:       {type: :string, 'x-nullable': true},
                  description:  {type: :string},
                  details:      {type: :array, items: {type: :string}}
                },
                required: ['available', 'name', 'service_type']
              }
            }
          },
          required: ['distance', 'duration', 'vehicles']
        )

        run_test! do
          black_taxi = body[:vehicles].select { |v| v[:name] == 'BlackTaxi' }.first

          expect(black_taxi).to eq(
            name:                    "BlackTaxi",
            value:                   "5178cd83-20bf-4991-b559-c1128dfae662",
            price:                   2100.0,
            eta:                     "< 0",
            available:               true,
            earliest_available_in:   30,
            service_type:            "gett",
            via:                     "gett",
            prebook:                 false,
            supports_driver_message: true,
            supports_flight_number:  true,
            description:             "A comfortable ride that takes bus lanes to get you there quicker.",
            details:                 ["2 minutes free waiting time and then 50p/min", "15 mins free waiting time for airport pickups"]
          )
        end
      end
    end
  end
end
