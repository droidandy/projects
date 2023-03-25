require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Statements API' do
  path '/statements' do
    get 'Responds with list of statements for current user' do
      tags 'Statements'

      consumes 'application/json'

      parameter name: :from,
                in: :query,
                type: :string,
                format: 'date-time',
                example: '2017-10-25T00:00:00Z',
                description: 'Use ISO8601 format',
                required: false
      parameter name: :to,
                in: :query,
                type: :string,
                format: 'date-time',
                example: '2017-11-12T23:59:59Z',
                description: 'Use ISO8601 format',
                required: false
      parameter name: :ids,
                in: :query,
                type: :array,
                items: {
                  type: :integer
                },
                description: 'List of statements IDs delimited by commas',
                example: '3016373,2908601',
                required: false

      paginatable!

      let(:body) { json_body('gett/finance_portal_api/statements') }
      let(:status) { 200 }

      before(:each) { stub_client(FinancePortalApi::Client, :statements, body, status) }

      user_authentication_required!

      response '200', 'successfully requested list of statements' do
        schema type: :object, properties: {
          statements: {
            type: :array,
            items: {
              '$ref' => '#/definitions/statement'
            }
          }
        }

        run_test!
      end

      response '422', '3rd-party API responds with error' do
        let(:body) { [].to_json }
        let(:status) { 400 }

        schema type: :object, properties: {
          errors: {
            type: :object,
            properties: {
              data: {
                type: :array,
                items: {
                  type: :string,
                  example: 'was not retrieved'
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
