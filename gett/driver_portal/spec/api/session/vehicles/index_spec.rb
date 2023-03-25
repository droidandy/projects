require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/session/vehicles' do
    get 'Responds with list of current user vehicles' do
      tags 'Vehicles'

      consumes 'application/json'

      user_authentication_required!

      response '200', 'successfully requested list of vehicles' do
        schema type: :object, properties: {
          vehicles: {
            type: :array,
            items: {
              '$ref' => '#/definitions/vehicle'
            }
          }
        }

        run_test!
      end
    end
  end
end
