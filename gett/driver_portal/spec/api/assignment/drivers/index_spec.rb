require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/assignment/drivers' do
    get 'Responds with list of drivers' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :query, in: :query, type: :string, required: false
      parameter name: :ready_for_assignment, in: :query, type: :boolean, required: false
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

      paginatable!

      user_authentication_required!

      response '200', 'successfully requested list of drivers' do
        schema type: :object, properties: {
          drivers: {
            type: :array,
            items: {
              '$ref' => '#/definitions/assignment_driver'
            }
          },
          total: {
            type: :integer,
            example: 11
          },
          page: {
            type: :integer,
            example: 1
          },
          per_page: {
            type: :integer,
            example: 5
          },
          channels: {
            type: :object,
            example: {
              agent_driver_assignment: 'abc123',
              driver_documents_status: '123abc'
            }
          }
        }

        run_test!
      end
    end
  end
end
