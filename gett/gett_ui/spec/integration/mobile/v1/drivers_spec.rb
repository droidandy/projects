require 'swagger_helper'

describe 'Drivers API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:lat)          { '51.26' }
  let(:lng)          { '-0.213' }
  let(:country_code) { 'gb' }

  path '/drivers/locations' do
    get 'List of drivers locations' do
      tags 'Drivers'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :lat, in: :query, type: :string
      parameter name: :lng, in: :query, type: :string
      parameter name: :country_code, in: :query, type: :string

      response '200', 'returns drivers information data' do
        before do
          stub_request(:get, "drivers_locations_url/#{country_code}/api?count=20&lat=#{lat}&lon=#{lng}&radius=1.5")
            .to_return(status: 200, body: File.read('./spec/fixtures/gett/drivers_response.json'))
        end

        schema(
          type: :object,
          properties: {
            drivers: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:       {type: [:string, :integer]},
                  status:   {type: :string},
                  car_type: {type: :string},
                  locations: {
                    type: :array,
                    items: {
                      type: :object,
                      properties: {
                        accuracy: {type: :number},
                        bearing:  {type: :number},
                        lat:      {type: :number},
                        lng:      {type: :number},
                        speed:    {type: :number},
                        ts:       {type: :number}
                      }
                    }
                  }
                }
              }
            }
          },
          required: ['drivers']
        )

        run_test!
      end
    end
  end

  path '/drivers/channel' do
    get 'Channel to obtain drivers locations' do
      tags 'Drivers'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :lat, in: :query, type: :string
      parameter name: :lng, in: :query, type: :string
      parameter name: :country_code, in: :query, type: :string

      response '200', 'returns drivers channel data' do
        schema(
          type: :object,
          properties: {
            channel: {type: :string}
          },
          required: ['channel']
        )

        run_test!
      end
    end
  end
end
