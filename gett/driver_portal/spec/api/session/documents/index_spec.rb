require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/session/documents' do
    get 'Responds with list of current user documents' do
      tags 'Documents'

      consumes 'application/json'

      user_authentication_required!

      response '200', 'successfully requested list of documents' do
        schema type: :object, properties: {
          documents: {
            type: :object,
            properties: {
              required: {
                type: :array,
                items: {
                  '$ref' => '#/definitions/document'
                }
              },
              optional: {
                type: :array,
                items: {
                  '$ref' => '#/definitions/document'
                }
              }
            }
          }
        }

        run_test!
      end
    end
  end
end
