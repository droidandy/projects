require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/users/{user_id}/vehicles' do
    get 'Responds with list of given user vehicles' do
      tags 'Vehicles'

      consumes 'application/json'

      parameter name: :user_id, in: :path

      user_authentication_required!

      let(:user_id) { create(:user).id }

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
