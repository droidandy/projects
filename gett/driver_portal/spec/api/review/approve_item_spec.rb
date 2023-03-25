require 'swagger_helper'

RSpec.describe 'Review API' do
  path '/users/{user_id}/review/{requirement}/approve' do
    post 'Approve a review requirement' do
      tags 'Review'
      consumes 'application/json'

      parameter(name: :user_id, in: :path, type: :integer)
      parameter(name: :requirement, in: :path, type: :string)
      parameter(
        name: :params,
        in: :body,
        schema: {
          type: :object,
          properties: {
            gett_phone: {
              type: 'string',
              example: '+41 123 456 789'
            }
          }
        }
      )

      let(:user_id) { create(:user, :with_driver_role).id }
      let(:requirement) { 'phone_contract' }
      let(:params) { {gett_phone_number: '123'} }
      before { create(:review, driver_id: user_id) }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'Review requirement approved' do
        schema(
          type: :object,
          properties: {
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
