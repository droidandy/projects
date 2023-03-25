require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User sessions API' do
  path '/session/stats' do
    get 'Responds with weekly stats for current user' do
      tags 'Sessions'

      consumes 'application/json'

      let(:body) { json_body('gett/finance_portal_api/driver_stats') }
      let(:status) { 200 }
      before(:each) { stub_client(FinancePortalApi::Client, :driver_stats, body, status) }

      user_authentication_required!

      response '200', 'successfully requested user stats' do
        schema '$ref' => '#/definitions/week_stats'

        run_test!
      end

      response '422', '3rd-party API responds with error' do
        let(:body) { {}.to_json }
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
