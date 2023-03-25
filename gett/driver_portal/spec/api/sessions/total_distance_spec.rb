require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User sessions API' do
  path '/session/total_distance' do
    get 'Responds with total distance driven by current user since current week' do
      tags 'Sessions'

      consumes 'application/json'

      let(:body) { json_body('gett/finance_portal_api/orders') }
      let(:status) { 200 }
      before(:each) { stub_client(FinancePortalApi::Client, :orders, body, status) }

      user_authentication_required!

      response '200', 'successfully requested user stats' do
        schema type: :object, properties: {
          distance: {
            type: :number,
            format: :float,
            example: 1.234
          }
        }

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
