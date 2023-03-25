require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/approval/start' do
    post 'Pick given user for approval' do
      tags 'Users'

      consumes 'application/json'

      let!(:user_1) { create :user, :with_driver_role, ready_for_approval_since: Time.current - 1.hour }

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
