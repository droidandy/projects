require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/deactivate' do
    post 'Activate multiple user' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :body,
                in: :body,
                description: 'Body',
                schema: {
                  type: :object,
                  properties: {
                    user_ids: {
                      type: :array,
                      items: {
                        type: :integer
                      }
                    }
                 }
              }

      let(:body) do
        {
          user_ids: [create(:user, :with_driver_role, :blocked).id, create(:user, :with_driver_role).id]
        }
      end

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      response '200', 'successfully sent invites to the users' do
        schema '$ref' => '#/definitions/batch_results'

        run_test!
      end
    end
  end
end
