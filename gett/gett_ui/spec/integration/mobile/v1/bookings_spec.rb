require 'swagger_helper'

describe 'Bookings API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:address) { create(:address, :baker_street) }
  let(:booking) { create(:booking, company: company, pickup_address: address) }

  path '/bookings' do
    get 'Shows list of bookings' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :query_params, in: :body, schema: {
        type: :object,
        properties: {
          page:                  {type: :integer},
          order:                 {type: :string},
          reverse:               {type: :boolean},
          search:                {type: :string},
          final:                 {type: :boolean},
          otp_code:              {type: :string},
          not_final:             {type: :boolean},
          from:                  {type: :string},
          to:                    {type: :string},
          map_size:              {type: :string},
          ids:                   {type: :array, items: {type: :integer}},
          status:                {type: :array, items: {type: :string}},
          payment_method:        {type: :array, items: {type: :string}},
          vehicle_types:         {type: :array, items: {type: :string}},
          include_passenger_ids: {type: :array, items: {type: :integer}},
          exclude_passenger_ids: {type: :array, items: {type: :integer}}
        }
      }

      response '200', 'returns bookings list' do
        let(:query_params) do
          { search: booking.service_id.to_s }
        end

        schema(
          type: :object,
          properties: {
            items: {type: :array, items: {'$ref' => '#/definitions/booking_row_schema'}},
            payment_methods: {type: :array, items: {type: :string}},
            pagination: {
              type: :object,
              properties: {
                current:   {type: :integer},
                total:     {type: :integer},
                page_size: {type: :integer}
              }
            }
          },
          required: ['items', 'payment_methods']
        )

        run_test!
      end
    end

    post 'Creates a booking' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          booking: {'$ref' => '#/definitions/booking_parameter_schema'}
        },
        required: [:booking]
      }

      let(:params) { { booking: booking_params } }

      response '200', 'creates a booking and returns booking data' do
        let(:vehicle) { create(:vehicle, :gett) }
        let(:booking_params) do
          attributes_for(:booking, booker: user).merge(
            scheduled_type: 'now',
            vehicle_value: vehicle.value,
            pickup_address: attributes_for(:address),
            destination_address: attributes_for(:address),
            passenger_id: user.id,
            passenger_phone: '+100123123123'
          )
        end

        before do
          stub_request(:post, "http://localhost:8000/faye")
            .to_return(status: 200, body: {channel_data: 'data'}.to_json)

          stub_request(:get, %r(https://maps.googleapis.com/maps/api/distancematrix/json))
            .to_return(status: 200, body: {distance: 50}.to_json)
        end

        schema('$ref' => '#/definitions/booking_schema')

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:booking_params) { attributes_for(:booking, booker: user) }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end

  path '/bookings/{id}' do
    get 'Shows a booking' do
      tags 'Bookings'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer

      let(:id) { create(:booking, company: company, booker: user, pickup_address: address).id }

      response '200', 'data returned' do
        schema('$ref' => '#/definitions/booking_schema')

        run_test!
      end
    end

    put 'Updates a booking' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          booking: {'$ref' => '#/definitions/booking_parameter_schema'}
        },
        required: [:booking]
      }

      let(:params) { { booking: booking_params } }

      response '200', 'updates a booking and returns booking data' do
        let(:id) do
          create(
            :booking, :future,
            company: company,
            booker: user,
            scheduled_at: 1.hour.from_now
          ).id
        end

        let(:vehicle) { create(:vehicle, :gett) }
        let(:booking_params) do
          Booking[id].to_h.merge(
            vehicle_value: vehicle.value,
            pickup_address: attributes_for(:address),
            destination_address: attributes_for(:address),
            passenger_id: user.id,
            passenger_phone: '+100123123123'
          )
        end

        before do
          stub_request(:post, "http://localhost:8000/faye")
            .to_return(status: 200, body: {channel_data: 'data'}.to_json)

          stub_request(:get, %r(https://maps.googleapis.com/maps/api/distancematrix/json))
            .to_return(status: 200, body: {distance: 50}.to_json)

          stub_request(:post, %r(http://localhost/oauth/token?.+scope=business))
            .to_return(status: 200, body: {'created_at' => Time.current.to_i, 'expires_in' => 1000}.to_json)

          stub_request(:patch, "http://localhost/business/rides/service-id?business_id=TestBusinessId")
            .to_return(status: 200, body: {id: 'id'}.to_json)
        end

        schema('$ref' => '#/definitions/booking_schema')

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:id) { booking.id }
        let(:booking_params) { booking.to_h }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end

  path '/bookings/new' do
    get 'Shows a new booking form' do
      tags 'Bookings'
      produces 'application/json'
      security [ api_key: [] ]

      response '200', 'returns information used to create a new booking' do
        schema('$ref' => '#/definitions/booking_form_schema')

        run_test!
      end
    end
  end

  path '/bookings/validate_references' do
    post "Validate a booking's reference" do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          booker_references: {'$ref' => '#/definitions/booker_references_schema'}
        },
        required: ['booker_references']
      }

      let(:params) do
        {
          booker_references: [{
            value: 'ref',
            booking_reference_id: booking_reference.id
          }]
        }
      end

      response '200', 'successfully validates booking reference' do
        let(:booking_reference) do
          create(:booking_reference, company: company, name: 'ref')
        end

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:booking_reference) do
          create(:booking_reference, :validation_required, company: company, name: 'ref')
        end

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end

  path '/bookings/{id}/edit' do
    get 'Shows existed booking form' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer

      let(:id) do
        create(
          :booking, :future,
          company: company,
          booker: user,
          scheduled_at: 1.hour.from_now
        ).id
      end

      response '200', 'returns information used to create a new booking' do
        schema('$ref' => '#/definitions/booking_form_schema')

        run_test!
      end
    end
  end

  path '/bookings/{id}/repeat' do
    get 'Shows a new booking form with filled data from existed one' do
      tags 'Bookings'
      consumes 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer

      response '200', 'returns information used to create a new booking based on existed one' do
        let(:id) { create(:booking, :cancelled, booker: user, passenger: user, pickup_address: address).id }

        schema('$ref' => '#/definitions/booking_form_schema')

        run_test!
      end

      response '404', 'not found' do
        let(:id) { create(:booking, booker: user, passenger: user, pickup_address: address).id }

        run_test!
      end
    end
  end

  path '/bookings/{id}/reverse' do
    get 'Shows a new booking form with filled data from existed one' do
      tags 'Bookings'
      consumes 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer

      response '200', 'returns information used to create a new booking based on existed one' do
        let(:id) { create(:booking, booker: user, passenger: user, pickup_address: address).id }

        schema('$ref' => '#/definitions/booking_form_schema')

        run_test!
      end
    end
  end

  path '/bookings/{id}/cancel' do
    put 'Cancel a booking' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          cancel_schedule: {type: :boolean}
        }
      }

      response '200', "successfully cancels a booking and returns it's data" do
        let(:address) { create(:address, :baker_street) }
        let(:id)      { create(:booking, :order_received, company: company, booker: user, pickup_address: address).id }
        let(:params)  { { cancel_schedule: false } }

        before do
          stub_request(:post, %r(http://localhost/oauth/token?.+scope=business))
            .to_return(status: 200, body: {'created_at' => Time.current.to_i, 'expires_in' => 1000}.to_json)

          stub_request(:post, "http://localhost/business/rides/service-id/cancel?business_id=TestBusinessId")
            .to_return(status: 200, body: {id: 'id'}.to_json)

          stub_request(:post, "http://localhost:8000/faye")
            .to_return(status: 200, body: {channel_data: 'data'}.to_json)
        end

        schema('$ref' => '#/definitions/booking_schema')

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:id) { create(:booking, :completed, company: company, booker: user, pickup_address: address).id }
        let(:params) { { cancel_schedule: false } }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end

  path '/bookings/{id}/cancellation_reason' do
    put 'Update cancellation reason' do
      tags 'Bookings'
      consumes 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          cancellation_reason: {type: :string}
        }
      }

      let(:params) { { cancellation_reason: 'mistaken_order' } }

      response '200', "updates booking's `cancellation_reason` and returns booking data" do
        let(:id) { create(:booking, :cancelled, booker: user, passenger: user, pickup_address: address).id }

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:id) { create(:booking, booker: user, passenger: user, pickup_address: address).id }

        run_test!
      end
    end
  end

  path '/bookings/{id}/rate' do
    put 'Rate a booking' do
      tags 'Bookings'
      consumes 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          rating: {type: :number},
          rating_reasons: {
            type: :array,
            items: {type: :string}
          }
        },
        required: ['rating']
      }

      let(:params) { { rating: 5 } }
      let(:id) { booking.id }

      response '200', "updates booking driver's rate and returns empty body" do
        let(:id) do
          create(:booking, :completed, :with_driver, passenger: user, booker: user, pickup_address: address).id
        end

        before do
          stub_request(:post, "http://localhost:8000/faye")
            .to_return(status: 200, body: {channel_data: 'data'}.to_json)
        end

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:id) { create(:booking, company: company, pickup_address: address, booker: user).id }
        run_test!
      end
    end
  end

  path '/bookings/vehicles' do
    post "Shows a booking's vehicles" do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          passenger_id:    {type: :integer},
          passenger_name:  {type: :string},
          passenger_phone: {type: :string},
          scheduled_at:    {type: :string},
          scheduled_type:  {type: :string},
          payment_method:  {type: :string},
          payment_card_id: {type: :integer},
          as_directed:     {type: :boolean},
          destination_address: {'$ref' => '#/definitions/address_schema'},
          pickup_address:      {'$ref' => '#/definitions/address_schema'},
          stops: {
            type: :array,
            items: {'$ref' => '#/definitions/stop_point_schema'}
          }
        }
      }

      let(:company) { create(:company, booking_fee: 2.0) }
      let(:booking) { create(:booking, booker: user, passenger: user, pickup_address: address) }

      response '200', 'returns available vehicles data' do
        let(:params) do
          {
            pickup_address: {
              postal_code: 'NW11 9UA',
              country_code: 'GB',
              lat: '51.5766877',
              lng: '-0.2156368',
              line: '3 Station Approach Highfield Avenue London',
              city: 'London'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              country_code: 'GB',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: '1 Milford Gardens Edgware',
              city: 'Cambridge'
            },
            scheduled_at: '2017-05-11T19:42:06+00:00',
            passenger_name: user.full_name,
            passenger_phone: user.phone
          }
        end

        before do
          stub_request(:get, %r(https://maps.googleapis.com/maps/api/distancematrix))
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/distance_response_in_miles.json').read)

          stub_request(:post, %r(http://localhost/oauth/token?.+scope=business))
            .to_return(status: 200, body: {'created_at' => Time.current.to_i, 'expires_in' => 1000}.to_json)

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
            distance:    {type: :string},
            duration:    {type: :string},
            booking_fee: {type: :number},
            vehicles: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  name:                  {type: :string},
                  available:             {type: :boolean},
                  earliest_available_in: {type: :number},
                  service_type:          {type: :string},
                  price:                 {type: :number, 'x-nullable': true},
                  trader_price:          {type: :number, 'x-nullable': true},
                  local_currency_symbol: {type: :string, 'x-nullable': true},
                  local_price:           {type: :number, 'x-nullable': true},
                  description:           {type: :string},
                  details: {
                    type: :array,
                    items: {type: :string}
                  }
                },
                required: ['name', 'service_type', 'available']
              }
            }
          }
        )

        run_test!
      end
    end
  end

  path '/bookings/form_details' do
    post "Shows a booking's form_details" do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          booking: {'$ref' => '#/definitions/booking_parameter_schema'},
          request_vehicles:       {type: :array, items: {type: :string}},
          request_scheduled_ats:  {type: :array, items: {type: :string}},
          request_payment_types:  {type: :array, items: {type: :string}},
          preserve_scheduled_ats: {type: :array, items: {type: :string}},
          preserve_payment_type:  {type: :string}
        },
        required: [:booking]
      }

      let(:params) { { booking: booking_params } }
      let(:company) { create(:company, booking_fee: 2.0) }
      let(:booking) { create(:booking, booker: user, passenger: user, pickup_address: address) }

      response '200', 'returns a booking form data' do
        let(:vehicle) { create(:vehicle, :gett) }
        let(:booking_params) do
          attributes_for(:booking, booker: user).merge(
            scheduled_type: 'now',
            vehicle_value: vehicle.value,
            pickup_address: attributes_for(:address),
            destination_address: attributes_for(:address),
            passenger_id: user.id,
            passenger_phone: '+100123123123'
          )
        end

        schema(
          type: :object,
          properties: {
            attrs: {
              type: :object,
              properties: {
                vehicle: {
                  type: :object,
                  properties: {
                    name:     {type: :string},
                    value:    {type: :string},
                    price:    {type: :number},
                    quote_id: {type: :string}
                  }
                },
                payment_type: {type: :string},
                special_requirements: {type: [:array, :boolean], items: {type: :string}},
                vehicle_vendor: {type: :string},
                scheduled_ats: {type: :array, items: {type: :string}},
                journey_type:  {type: :string, 'x-nullable': true}
              }
            },
            unavailable_scheduled_ats: {type: :array, items: {type: :string}},
            journey_types: {type: :array, items: {type: :string}},
            payment_type_options: {type: :array, items: {type: :string}},
            special_requirement_options: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  key:   {type: :string},
                  label: {type: :string}
                }
              }
            },
            vehicle_vendor_options: {type: :array, items: {type: :string}},
            errors: {type: :object},
            alerts: {type: :object},
            vehicles_data: {
              type: :object,
              properties: {
                duration:    {type: :string},
                booking_fee: {type: :number},
                vehicles: {
                  type: :array,
                  items: {
                    type: :object,
                    properties: {
                      name:                  {type: :string},
                      available:             {type: :boolean},
                      earliest_available_in: {type: :number},
                      service_type:          {type: :string},
                      price:                 {type: :number, 'x-nullable': true},
                      trader_price:          {type: :number, 'x-nullable': true},
                      local_currency_symbol: {type: :string, 'x-nullable': true},
                      local_price:           {type: :number, 'x-nullable': true},
                      description:           {type: :string},
                      details: {
                        type: :array,
                        items: {type: :string}
                      }
                    },
                    required: ['name', 'service_type', 'available']
                  }
                }
              }
            }
          },
          required: [:special_requirement_options, :attrs]
        )

        run_test!
      end
    end
  end
end
