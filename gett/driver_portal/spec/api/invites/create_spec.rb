require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Invitation API' do
  path '/users/{user_id}/invites' do
    post 'Sends invite to user' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :user_id,
        in: :path,
        type: :integer


      let(:user) { create(:user, :with_driver_role) }
      let(:user_id) { user.id }

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      response '200', 'successfully sent invite to the user' do
        schema '$ref' => '#/definitions/invite'

        run_test!
      end
    end
  end
end
