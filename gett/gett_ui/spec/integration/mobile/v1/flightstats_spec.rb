require 'swagger_helper'

describe 'Flightstats API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:flight_id) { 986682279 }
  let(:flight)    { '400' }
  let(:year)      { '2018' }
  let(:month)     { '06' }
  let(:day)       { '21' }

  path '/flightstats/flights' do
    get 'Flights on a specific date prodived by Flightstats service' do
      tags 'Flightstats'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :flight, in: :query, type: :string
      parameter name: :year,   in: :query, type: :string
      parameter name: :month,  in: :query, type: :string
      parameter name: :day,    in: :query, type: :string

      before { stub_api! }

      after { Rails.cache.clear }

      response '200', 'returns flight schedule(s)' do
        let(:response_body) { Rails.root.join('spec/fixtures/flightstats/departing_schedule_response.json').read }

        schema(
          type: :array,
          items: {
            type: :object,
            properties: {
              carrier:   {type: :string},
              flight:    {type: :string},
              airline:   {type: :string},
              arrival:   {'$ref' => '#/definitions/flight_schema'},
              departure: {'$ref' => '#/definitions/flight_schema'}
            }
          }
        )

        run_test!
      end

      response '404', 'invalid request' do
        let(:response_body) { Rails.root.join('spec/fixtures/flightstats/empty_departing_schedule_response.json').read }

        run_test!
      end
    end
  end

  path '/flightstats/schedule_states' do
    get 'Flights on a period time prodived by Flightstats service' do
      tags 'Flightstats'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :flight, in: :query, type: :string
      parameter name: :year,   in: :query, type: :string
      parameter name: :month,  in: :query, type: :string
      parameter name: :day,    in: :query, type: :string

      before do
        stub_request(:get, %r(https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/\w+/\d+/dep/\d{4}/\d+/\d+))
          .to_return(status: 200, body: response_body)
      end

      after { Rails.cache.clear }

      response '200', 'returns flight states)' do
        let(:response_body) { Rails.root.join('spec/fixtures/flightstats/state_flight.json').read }

        schema(
          type: :array,
          items: {
            type: :object,
            properties: {
              carrier:   {type: :string},
              flight:    {type: :string},
              flight_id: {type: :number},
              airline:   {type: :string},
              arrival:   {'$ref' => '#/definitions/flight_state_schema'},
              departure: {'$ref' => '#/definitions/flight_state_schema'}
            }
          }
        )

        run_test!
      end

      response '404', 'invalid request' do
        let(:response_body) { Rails.root.join('spec/fixtures/flightstats/error_state_flight.json').read }

        run_test!
      end
    end
  end

  path '/flightstats/track' do
    get 'Flight current moving' do
      tags 'Flightstats'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :flight_id, in: :query, type: :number

      before do
        stub_request(:get, %r(https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/track/\d+))
          .to_return(status: 200, body: response_body)
      end

      after { Rails.cache.clear }

      response '200', 'returns flight traking)' do
        let(:response_body) { Rails.root.join('spec/fixtures/flightstats/flight_track.json').read }

        schema(
          type: :object,
            properties: {
              lon:    {type: :number},
              lat:    {type: :number},
              date:   {type: :string}
            }
        )

        run_test!
      end

      response '404', 'invalid request' do
        let(:response_body) { Rails.root.join('spec/fixtures/flightstats/error_flight_tracking_response.json').read }

        run_test!
      end
    end
  end

  def stub_api!
    stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/\w+/\d+/departing/\d{4}/\d+/\d+))
      .to_return(status: 200, body: response_body)
    stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/\w+/\d+/arriving/\d{4}/\d+/\d+))
      .to_return(status: 200, body: response_body)
  end
end
