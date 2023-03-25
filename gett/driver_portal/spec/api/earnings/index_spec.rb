require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Earnings API' do
  path '/earnings' do
    get 'Responds with list of earnings for current user' do
      tags 'Earnings'

      consumes 'application/json'

      parameter name: :from,
                in: :query,
                type: :string,
                format: 'date-time',
                example: '2017-11-15T00:00:00Z',
                description: 'Use ISO8601 format'
      parameter name: :to,
                in: :query,
                type: :string,
                format: 'date-time',
                example: '2017-11-16T23:59:59Z',
                description: 'Use ISO8601 format'

      paginatable!

      let(:from) { Time.current.iso8601 }
      let(:to) { Time.current.iso8601 }
      let(:body) { json_body('gett/earnings_api/earnings') }
      let(:status) { 200 }
      before(:each) { stub_client(GettEarningsApi::Client, :earnings, body, status) }

      user_authentication_required!

      response '200', 'successfully requested list of earnings' do
        schema type: :object, properties: {
          earnings: {
            type: :array,
            items: {
              '$ref' => '#/definitions/earning'
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
