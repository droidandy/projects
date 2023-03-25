require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users/sync' do
    post 'Sync users with finance portal' do
      tags 'Users'

      consumes 'application/json'
      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      let(:body) { json_body('gett/finance_portal_api/drivers') }

      before do
        stub_client(FinancePortalApi::Client, :drivers, body)
      end

      response '200', 'users were successfully synced' do
        run_test!
      end
    end
  end
end
