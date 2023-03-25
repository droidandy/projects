require 'swagger_helper'

RSpec.describe 'Review API' do
  path '/users/{user_id}/review/stats' do
    get 'Get review stats' do
      tags 'Review'

      parameter(name: :user_id, in: :path, type: :integer)

      let(:user_id) { create(:user, :with_driver_role).id }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'Review approved' do
        schema(
          type: :object,
          properties: {
            gett_phone: {
              type: :string
            },
            compliance_verified: {
              type: :boolean
            }
          }
        )

        run_test!
      end
    end
  end
end
