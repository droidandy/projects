require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/session/vehicles/{id}' do
    delete 'Deactivates current user vehicle' do
      tags 'Vehicles'

      consumes 'application/json'

      parameter name: :id, in: :path

      user_authentication_required! current_user_traits: %i[with_driver_role]

      let(:vehicles) { create_list :vehicle, 2, user: current_user }

      let(:id) { vehicles.first.id }

      response '200', 'successfully deactivate vehicle' do
        run_test!
      end
    end
  end
end
