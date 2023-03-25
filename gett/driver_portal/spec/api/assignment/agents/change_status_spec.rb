require 'swagger_helper'

RSpec.describe 'Agents API' do
  path '/assignment/agents/change_status' do
    post 'Change agent status' do
      tags 'Agents'

      consumes 'application/json'

      parameter(
        name: :params,
        in: :body,
        schema: {
          type: :object,
          properties: {
            status: {
              type: 'integer',
              example: 'available'
            }
          }
        }
      )

      let(:agent_id) { create(:user, :with_onboarding_agent_role).id }
      let(:params) { { status: 'available' } }
      user_authentication_required!(current_user_traits: [:with_onboarding_agent_role])

      response '200', 'Driver assigned' do
        run_test!
      end
    end
  end
end
