require 'swagger_helper'

RSpec.describe 'Agents API' do
  path '/assignment/agents/{agent_id}/assign_driver' do
    post 'Assign a driver to an agent' do
      tags 'Agents'

      consumes 'application/json'

      parameter(name: :agent_id, in: :path, type: :integer)
      parameter(
        name: :params,
        in: :body,
        schema: {
          type: :object,
          properties: {
            driver_id: {
              type: 'integer',
              example: 1
            }
          }
        }
      )

      let(:driver) { create(:user, :with_driver_role) }
      let(:agent_id) { create(:user, :with_onboarding_agent_role).id }
      let(:params) { { driver_id: driver.id } }
      before { create(:review, driver: driver) }
      user_authentication_required!(current_user_traits: [:with_onboarding_agent_role])

      response '200', 'Driver assigned' do
        schema '$ref' => '#/definitions/assignment_driver'

        run_test!
      end
    end
  end
end
