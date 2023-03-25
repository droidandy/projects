require 'swagger_helper'

RSpec.describe 'Review API' do
  path '/users/{user_id}/review/history' do
    get 'Get review history' do
      tags 'Review'

      parameter(name: :user_id, in: :path, type: :integer)

      let(:user_id) { create(:user, :with_driver_role).id }
      before { create(:review, driver_id: user_id) }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'Review approved' do
        schema(
          type: :object,
          properties: {
            reviews: {
              type: :array,
              items: {
                '$ref' => '#/definitions/review'
              }
            }
          }
        )

        run_test!
      end
    end
  end
end
