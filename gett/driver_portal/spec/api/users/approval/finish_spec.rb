require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/{id}/approval/finish' do
    post 'Finish given user approval sending him a message' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :id, in: :path
      parameter name: :body,
        in: :body,
        schema: {
          type: :object,
          properties: {
            subject: {
              type: :string
            },
            message: {
              type: :string
            }
          }
        }

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:id) { create(:user, :with_driver_role, approver: current_user).id }
      let(:body) do
        { subject: 'Subject', message: 'Message' }
      end

      response '200', 'successfully finish approval' do
        run_test!
      end
    end
  end
end
