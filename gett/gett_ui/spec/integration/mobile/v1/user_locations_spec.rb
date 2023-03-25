require 'swagger_helper'

describe 'User Locations API', swagger_doc: 'mobile/v1/swagger.json' do
  before { ApplicationService::Context.set_context!(user: user) }

  path '/user_locations' do
    post 'Create user location' do
      tags 'User Locations'
      consumes 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          lat: {type: :float},
          lng: {type: :float}
        },
        required: ['lat', 'lng']
      }

      response '200', 'creates new user location and returns empty body' do
        let(:params) do
          {
            lat: '51.26', lng: '0.12'
          }
        end

        run_test!
      end
    end
  end
end
