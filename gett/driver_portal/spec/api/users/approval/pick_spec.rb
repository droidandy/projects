require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}/approval/pick' do
    post 'Pick given user for approval' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let(:user) { create(:user, :with_driver_role) }
      let(:id) { user.id }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'user picked for approval successfully' do
        schema type: :object, properties: {
          driver_to_approve_id: {
            type: :integer,
            description: 'Picked user ID'
          }
        }

        run_test!
      end
    end
  end
end
