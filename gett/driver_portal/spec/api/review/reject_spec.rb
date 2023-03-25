require 'swagger_helper'

RSpec.describe 'Review API' do
  path '/users/{user_id}/review/reject' do
    post 'Reject a review' do
      tags 'Review'
      consumes 'application/json'

      parameter(name: :user_id, in: :path, type: :integer)
      parameter(
        name: :params,
        in: :body,
        schema: {
          type: :object,
          properties: {
            comment: {
              type: 'string',
              example: 'Comment'
            }
          }
        }
      )

      let(:user_id) { create(:user, :with_driver_role).id }
      let(:params) { { comment: 'Comment' } }
      before { create(:review, driver_id: user_id) }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'Review rejected' do
        schema(
          type: :object,
          properties: {
            review: {
              type: :object,
              properties: {
                '$ref' => '#/definitions/review'
              }
            },
            review_update: {
              type: :object,
              properties: {
                '$ref' => '#/definitions/review_update'
              }
            }
          }
        )

        run_test!
      end
    end
  end
end
