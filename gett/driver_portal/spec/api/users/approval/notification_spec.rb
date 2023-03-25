require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{user_id}/approval/notification' do
    get 'Approval Notification Preview' do
      tags 'Users', 'Approval', 'Notification'

      parameter(name: :user_id, in: :path, type: :integer)

      let(:user_id) { create(:user, :with_driver_role).id }

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'Notification Sent' do
        schema(
          type: :object,
          properties: {
            subject: {
              type: :string
            },
            body: {
              type: :string
            }
          }
        )

        run_test!
      end
    end
  end
end
