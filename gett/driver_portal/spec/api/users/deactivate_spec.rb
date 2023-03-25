require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}/deactivate' do
    post 'Deactivates user' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let(:user) { create :user, :with_driver_role }
      let(:id) { user.id }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'user was successfully deactivated' do
        schema '$ref' => '#/definitions/user'

        run_test!
      end
    end
  end
end
