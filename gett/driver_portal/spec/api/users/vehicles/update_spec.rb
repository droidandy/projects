require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Vehicles API' do
  path '/users/{user_id}/vehicles/{id}' do
    put 'Updates current user vehicle' do
      tags 'Vehicles'

      consumes 'multipart/form-data'

      parameter name: :user_id, in: :path
      parameter name: :id, in: :path
      parameter name: :model,
                in: :formData,
                type: :string

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:vehicle) { create(:vehicle) }
      let(:user_id) { vehicle.user.id }
      let(:id) { vehicle.id }
      let(:model) { 'New model' }

      response '200', 'successfully update vehicle' do
        schema '$ref' => '#/definitions/vehicle'

        run_test!
      end
    end
  end
end
