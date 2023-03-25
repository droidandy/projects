require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/users/{user_id}/vehicles/{vehicle_id}/documents' do
    get 'Responds with list of documents for given vehicle of given user' do
      tags 'Documents'

      consumes 'application/json'

      parameter name: :user_id, in: :path
      parameter name: :vehicle_id, in: :path

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:user) { (create :user) }
      let(:user_id) { user.id }
      let(:vehicle_id) { (create :vehicle, user: user).id }

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
