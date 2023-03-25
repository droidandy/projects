require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Earnings API' do
  path '/earnings/generate_csv' do
    post 'Generates CSV with earnings data' do
      tags 'Earnings'

      consumes 'application/json'

      parameter name: :body,
        in: :body,
        description: 'Session object that contains information about user',
        schema: {
          type: :object,
          properties: {
            from: {
              type: :string,
              format: 'date-time',
              example: '2017-11-15T00:00:00Z',
              description: 'Use ISO8601 format'
            },
            to: {
              type: :string,
              format: 'date-time',
              example: '2017-11-16T23:59:59Z',
              description: 'Use ISO8601 format'
            },
            external_ids: {
              type: :array,
              items: {
                type: :string
              },
              description: 'List of external IDs to filter by',
              example: '2249477303,uk_10_151281_93669514_2017-11-13...2017-11-20'
            }
          },
          required: [ :from, :to ]
        }

      let(:body) do
        {
          from: Time.current.iso8601,
          to: Time.current.iso8601,
          external_ids: ['2249477303', 'uk_10_151281_93669514_2017-11-13...2017-11-20']
        }
      end

      let(:earnings) { json_body('gett/earnings_api/earnings') }
      before(:each) { stub_client(GettEarningsApi::Client, :earnings, earnings) }

      user_authentication_required!

      response '200', 'CSV generated successfully' do
        schema type: :object, properties: {
          url: {
            type: :string,
            example: '/system/uploads/downloads/filename.csv',
            description: 'URL of generated file'
          }
        }

        run_test!
      end
    end
  end
end
