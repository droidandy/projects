require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}/stats' do
    get 'Responds with weekly stats for given user' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let!(:user) { create(:user, :with_driver_role) }
      let(:id) { user.id }
      let(:body) { json_body('gett/finance_portal_api/driver_stats') }
      let(:status) { 200 }
      before(:each) { stub_client(FinancePortalApi::Client, :driver_stats, body, status) }

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

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
