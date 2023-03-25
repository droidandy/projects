require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/session/assignment/drivers' do
    get 'Responds with list of drivers assigned to current user' do
      tags 'Review'

      consumes 'application/json'

      user_authentication_required!

      response '200', 'successfully requested list of drivers' do
        schema type: :object, properties: {
          drivers: {
            type: :array,
            items: {
              '$ref' => '#/definitions/assignment_driver'
            }
          }
        }

        run_test!
      end
    end
  end
end
