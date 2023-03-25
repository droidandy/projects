require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/users/{user_id}/vehicles/{vehicle_id}/documents/kinds' do
    get 'Responds with list of document kinds for given vehicle of given user' do
      tags 'Documents'

      consumes 'application/json'

      parameter name: :user_id, in: :path
      parameter name: :vehicle_id, in: :path

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:user) { (create :user) }
      let(:user_id) { user.id }
      let(:vehicle_id) { (create :vehicle, user: user).id }

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
