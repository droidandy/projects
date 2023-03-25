require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'System API' do
  path '/system/status' do
    get 'Responds with external APIs availability status' do
      tags 'System'

      consumes 'application/json'

      before(:each) do
        stub_client(GettEarningsApi::Client, :earnings, {}.to_json)
        stub_client(GettFleetApi::Client, :drivers, {}.to_json)
        stub_client(FinancePortalApi::Client, :statements, {}.to_json)
        stub_client(FinancePortalApi::Client, :statement_html, {}.to_json)
        stub_client(FinancePortalApi::Client, :order, {}.to_json)
        stub_client(FinancePortalApi::Client, :driver_stats, {}.to_json)
      end

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      response '200', 'status successfully requested' do
        schema type: :object, properties: {
          earnings: {
            type: :object,
            properties: {
              earnings: {
                type: :boolean
              }
            }
          },
          fleet: {
            type: :object,
            properties: {
              drivers: {
                type: :boolean
              }
            }
          },
          finance_portal: {
            type: :object,
            properties: {
              driver_stats: {
                type: :boolean
              },
              order: {
                type: :boolean
              },
              statement_html: {
                type: :boolean
              },
              statements: {
                type: :boolean
              }
            }
          }
        }

        run_test!
      end
    end
  end
end
