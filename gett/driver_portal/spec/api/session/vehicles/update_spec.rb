require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/session/vehicles/{id}' do
    put 'Updates current user vehicle' do
      tags 'Vehicles'

      consumes 'multipart/form-data'

      parameter name: :id, in: :path
      parameter name: :title,
                in: :formData,
                type: :string

      user_authentication_required! current_user_traits: %i[with_driver_role]

      let(:id) { create(:vehicle, user: current_user).id }
      let(:title) { 'New title' }

      response '200', 'successfully update vehicle' do
        schema '$ref' => '#/definitions/vehicle'

        run_test!
      end
    end
  end
end
