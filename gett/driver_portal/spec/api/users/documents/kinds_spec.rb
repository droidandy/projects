require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/users/{user_id}/documents/kinds' do
    get 'Responds with list of document kinds for given user' do
      tags 'Documents'

      consumes 'application/json'

      parameter name: :user_id, in: :path

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:user_id) { (create :user).id }

      response '200', 'successfully requested list of document kinds' do
        schema type: :object, properties: {
          kinds: {
            type: :array,
            items: {
              '$ref' => '#/definitions/documents_kind'
            }
          }
        }

        run_test!
      end
    end
  end
end
