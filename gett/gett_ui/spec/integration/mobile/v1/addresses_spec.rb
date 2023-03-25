require 'swagger_helper'

describe 'Addresses API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:open_key)          { Settings.google_api.open_key }
  let(:autocomplete_url)  { Settings.google_api.autocomplete_url }
  let(:nearby_search_url) { Settings.google_api.nearby_search_url }
  let(:geocode_url)       { Settings.google_api.geocode_url }
  let(:details_url)       { Settings.google_api.details_url }
  let(:channel_name)      { Settings.google_api.channel }

  path '/addresses' do
    get 'List of addresses' do
      tags 'Addresses'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :string, in: :query, type: :string, required: true
      parameter name: :'countries_filter[]', in: :query, type: :array, collectionFormat: :multi

      # Add variant for Pcaw::List
      response '200', 'returns list of addresses' do
        let(:string) { 'address' }
        let(:'countries_filter[]') { ['gb', 'li'] }

        before do
          stub_request(:get, "#{autocomplete_url}?channel=#{channel_name}&components=country:gb|country:li&input=#{string}&key=#{open_key}&language=en")
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/addresses_list_response.json'))
        end

        schema(
          type: :object,
          properties: {
            list: {
              type: :array,
              items: {'$ref' => '#/definitions/suggested_address_schema'}
            },
            status: {type: :string}
          },
          required: ['list']
        )

        run_test!
      end
    end
  end

  path '/addresses/geocode' do
    get 'Geocoded address' do
      tags 'Addresses'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :lat,         in: :query, type: :number,  required: false
      parameter name: :lng,         in: :query, type: :number,  required: false
      parameter name: :location_id, in: :query, type: :string,  required: false
      parameter name: :google,      in: :query, type: :boolean, required: false
      parameter name: :predefined,  in: :query, type: :boolean, required: false
      parameter name: :string,      in: :query, type: :string,  required: false

      response '200', 'returns geocoded data' do
        schema(
          type: :object,
          properties: {
            postal_code:       {type: :string},
            country_code:      {type: :string},
            country:           {type: :string},
            region:            {type: :string, 'x-nullable': true},
            city:              {type: :string},
            lat:               {type: :number},
            lng:               {type: :number},
            place_id:          {type: :string},
            status:            {type: :string},
            timezone:          {type: :string},
            airport:           {type: :string, 'x-nullable': true},
            street_name:       {type: :string, 'x-nullable': true},
            street_number:     {type: :string, 'x-nullable': true},
            point_of_interest: {type: :string, 'x-nullable': true},
            formatted_address: {type: :string}
          },
          required: ['postal_code', 'country_code', 'airport', 'lat', 'lng']
        )

        context 'when lat and lng provided' do
          let(:lat) { 51.26 }
          let(:lng) { 0.12 }

          before do
            stub_request(:get, "#{geocode_url}?channel=#{channel_name}&key=#{open_key}&language=en&latlng=51.26,0.12&result_type=street_address%7Cairport%7Cpremise")
              .to_return(status: 200, body: Rails.root.join('spec/fixtures/google_api/reverse_geocode/postal_town_response.json').read)
          end

          run_test!
        end

        context 'when google and location_id provided' do
          let(:google)      { true }
          let(:location_id) { 'ChIJFbp6NM8adkgRdOYUaV-EQlw' }

          before do
            stub_request(:get, "#{details_url}?channel=#{channel_name}&key=#{open_key}&language=en&place_id=#{location_id}")
              .to_return(status: 200, body: Rails.root.join('spec/fixtures/google_api/address_details/address_response.json'))
          end

          run_test!
        end

        context 'when predefined and string provided' do
          let!(:predefined_address) { create(:predefined_address) }
          let(:predefined)          { true }
          let(:string)              { predefined_address.line }

          run_test!
        end
      end

      response '404', 'invalid request' do
        let(:lat) { 51.26 }
        let(:lng) { 0.12 }

        before do
          stub_request(:get, "#{geocode_url}?channel=#{channel_name}&key=#{open_key}&language=en&latlng=51.26,0.12&result_type=street_address%7Cairport%7Cpremise")
            .to_return(status: 400, body: Rails.root.join('spec/fixtures/google_api/invalid_request_response.json'))
        end

        run_test!
      end
    end
  end

  path '/addresses/quick_search' do
    get 'List of addresses by location' do
      tags 'Addresses'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :lat, in: :query, type: :number
      parameter name: :lng, in: :query, type: :number
      parameter name: :criterion, in: :query, type: :string
      parameter name: :next_page_token, in: :query, type: :string

      response '200', 'returns list of addresses' do
        let(:lat)       { 1 }
        let(:lng)       { 2 }
        let(:criterion) { 'lodging' }
        let(:next_page_token) { nil }

        before do
          stub_request(:get, "#{nearby_search_url}?channel=#{channel_name}&key=#{open_key}&language=en&location=1,2&radius=4830&type=lodging")
            .to_return(status: 200, body: Rails.root.join('spec/fixtures/google_api/nearbysearch_response.json'))
        end

        schema(
          type: :object,
          properties: {
            list: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:    {type: :string, 'x-nullable': true},
                  name:  {type: :string},
                  lat:   {type: :number, 'x-nullable': true},
                  lng:   {type: :number, 'x-nullable': true},
                  types: {type: :array, items: {type: :string}}
                }
              }
            },
            next_page_token: {type: :string},
            status:          {type: :string}
          },
          required: ['status', 'list']
        )

        run_test!
      end
    end
  end
end
