require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}/log_in_as' do
    post 'Creates new session associated with given user' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let(:user) { create(:user, :with_driver_role) }
      let(:id) { user.id }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'new session has been created' do
        schema type: :object, properties: {
          access_token: {
            type: :string,
            example: JWT_TOKEN_EXAMPLE,
            description: 'Created JWT token for the session'
          },
          user: {
            '$ref' => '#/definitions/user'
          }
        }

        run_test!
      end
    end
  end
end
