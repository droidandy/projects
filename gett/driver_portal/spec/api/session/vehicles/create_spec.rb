require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/session/vehicles' do
    post 'Creates news vehicle for current user' do
      tags 'Vehicles'

      consumes 'multipart/form-data'

      parameter name: :title,
                in: :formData,
                type: :string

      user_authentication_required! current_user_traits: %i[with_driver_role]

      let(:title) { 'Title' }

      response '200', 'successfully create vehicle' do
        schema '$ref' => '#/definitions/vehicle'

        run_test!
      end
    end
  end
end
