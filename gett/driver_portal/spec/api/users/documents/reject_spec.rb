require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/users/{user_id}/documents/{id}/reject' do
    post 'Reject given document and save metadata' do
      tags 'Documents'

      consumes 'application/json'

      parameter name: :user_id, in: :path
      parameter name: :id, in: :path
      parameter name: :body,
        in: :body,
        schema: {
          type: :object,
          properties: {
            metadata: {
              type: :object
            },
            comment: {
              type: :string
            }
          }
        }

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:user) { create(:user) }
      let(:user_id) { user.id }
      let(:id) { create(:document, user: user).id }
      let(:body) do
        { comment: 'Comment', metadata: { meta: 'data' } }
      end

      response '200', 'successfully approve document' do
        schema '$ref' => '#/definitions/document'

        run_test!
      end
    end
  end
end
