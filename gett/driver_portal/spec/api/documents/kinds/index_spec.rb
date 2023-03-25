require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/documents/kinds' do
    get 'Responds with list of document kinds' do
      tags 'Documents'

      consumes 'application/json'

      user_authentication_required!

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
