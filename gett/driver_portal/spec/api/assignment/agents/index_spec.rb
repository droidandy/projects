require 'swagger_helper'

RSpec.describe 'Agents API' do
  path '/assignment/agents' do
    get 'Responds with list of onboarding agents and managers' do
      tags 'Agents'

      consumes 'application/json'
      paginatable!
      user_authentication_required!(current_user_traits: [:with_onboarding_agent_role])

      response '200', 'successfully returns list of compliance agents and managers' do
        schema type: :object, properties: {
          users: {
            type: :array,
            items: {
              '$ref' => '#/definitions/agent'
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
          channels: {
            type: :object,
            example: {
              agent_status_update: 'abc123',
              agent_driver_assignment: '123abc'
            }
          }
        }

        run_test!
      end
    end
  end
end
