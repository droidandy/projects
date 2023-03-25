require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User sessions API' do
  path '/session/metrics' do
    get 'Responds with metrics for current user' do
      tags 'Sessions'

      consumes 'application/json'

      let(:body) { json_body('gett/fleet_api/driver') }
      let(:status) { 200 }
      before(:each) { stub_client(GettFleetApi::Client, :driver, body, status, response_class: GettFleetApi::Response) }

      user_authentication_required! current_user_traits: [:with_driver_role]

      response '200', 'successfully requested user metrics' do
        schema '$ref' => '#/definitions/metrics'

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
