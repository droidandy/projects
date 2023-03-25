require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/users/{user_id}/documents' do
    get 'Responds with list of documents for given user' do
      tags 'Documents'

      consumes 'application/json'

      parameter name: :user_id, in: :path

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:user_id) { (create :user).id }

      response '200', 'successfully requested list of documents' do
        schema type: :object, properties: {
          documents: {
            type: :array,
            items: {
              '$ref' => '#/definitions/document'
            }
          }
        }

        run_test!
      end
    end
  end
end
