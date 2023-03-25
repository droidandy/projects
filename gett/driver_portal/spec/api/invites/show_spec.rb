require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Invitation API' do
  path '/invites/{token}' do
    get 'Get information about invite' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :token,
        in: :path,
        type: :string

      let(:user) { create(:user, :with_driver_role) }
      let(:admin) { create(:user, :with_site_admin_role) }

      let(:service) do
        service = Invites::Create.new(admin, user_id: user.id)
        service.execute!

        raise 'Something went wrong with token creation' unless service.success?

        service
      end

      let(:invite) { service.invite }
      let(:token) { service.token }

      response '200', 'successfully requested information about invite' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/invite'
        }

        run_test!
      end
    end
  end
end
