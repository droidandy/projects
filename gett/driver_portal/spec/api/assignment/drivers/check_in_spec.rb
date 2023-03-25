require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/assignment/drivers/{id}/check_in' do
    post 'Check in given user' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let(:user) { create(:user, :with_driver_role) }
      let(:id) { user.id }
      let!(:review) { create :review, driver: user }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'user picked for approval successfully' do
        schema '$ref' => '#/definitions/assignment_driver'

        run_test!
      end
    end
  end
end
