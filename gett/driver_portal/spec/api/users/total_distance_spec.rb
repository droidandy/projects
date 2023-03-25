require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}/total_distance' do
    get 'Responds with total distance driven by given user since current week' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let!(:user) { create(:user, :with_driver_role) }
      let(:id) { user.id }
      let(:body) { json_body('gett/finance_portal_api/orders') }
      let(:status) { 200 }
      before(:each) { stub_client(FinancePortalApi::Client, :orders, body, status) }

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

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
