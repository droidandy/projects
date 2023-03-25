require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/session/vehicles/{id}/set_as_current' do
    post 'Marks user vehicle as current' do
      tags 'Vehicles'

      consumes 'application/json'

      parameter name: :id, in: :path

      user_authentication_required! current_user_traits: %i[with_driver_role]

      let(:id) { create(:vehicle, user: current_user).id }

      before(:each) do
        stub_client(GettDriversApi::Client, :update_driver, {}.to_json)
      end

      response '200', 'successfully deactivate vehicle' do
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
