require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users' do
    get 'Responds with list of back-office users' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :query, in: :query, type: :string
      parameter name: :sort_column,
        in: :query,
        type: :string,
        enum: Users::Search::SORTABLE_COLUMNS
      parameter name: :sort_direction,
        in: :query,
        type: :string,
        enum: %w[asc desc]

      paginatable!

      let(:query) { 'John' }
      let(:sort_column) { 'first_name' }
      let(:sort_direction) { 'asc' }

      user_authentication_required!

      response '200', 'successfully requested list of users' do
        schema type: :object, properties: {
          users: {
            type: :array,
            items: {
              '$ref' => '#/definitions/user'
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
          last_sync_at: {
            type: :string,
            format: 'date-time',
            example: '2017-12-07 15:22:11 +0000',
            'x-nullable' => true
          },
          sync_in_progress: {
            type: :boolean
          }
        }

        run_test!
      end
    end
  end
end
