require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}' do
    get 'Responds with user data' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let!(:user) { create :user, :with_driver_role }
      let(:id) { user.id }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'successfully requested user data' do
        schema '$ref' => '#/definitions/user'

        run_test!
      end

      response '404', 'user not found' do
        let(:id) { 0 }

        run_test!
      end
    end
  end
end
