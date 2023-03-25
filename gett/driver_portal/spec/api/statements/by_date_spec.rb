require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Statements API' do
  path '/statements/by_date' do
    get 'Responds with statement details, covering given date' do
      tags 'Statements'

      consumes 'application/json'

      parameter name: :issued_at,
                in: :query,
                type: :string,
                format: 'date-time',
                example: '2017-11-16T23:59:59Z',
                description: 'Pass earning issued_at in ISO8601 format'

      let(:issued_at) { Time.current.iso8601 }

      let(:body) { json_body('gett/finance_portal_api/statements') }
      before(:each) {
        stub_client(FinancePortalApi::Client, :statements, body)
      }

      user_authentication_required!

      response '200', 'successfully requested list of earnings' do
        schema '$ref' => '#/definitions/statement'

        run_test!
      end
    end
  end
end
