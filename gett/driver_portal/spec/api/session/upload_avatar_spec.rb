require 'rails_helper'
require 'swagger_helper'
include ActionDispatch::TestProcess

RSpec.describe 'User sessions API' do
  path '/session/avatar' do
    put 'Upload new avatar for given user' do
      tags 'Sessions'

      consumes 'multipart/form-data'

      parameter name: :avatar,
                in: :formData,
                type: :file

      user_authentication_required! current_user_traits: %i[with_apollo_driver_role]
      with_admin_user admin_traits: %i[with_site_admin_role]

      let(:avatar) { fixture_file_upload('1x1.jpg') }

      response '200', 'successfully create document' do
        schema type: :object, properties: {
          avatar_url: {
            type: :string,
          }
        }

        run_test!
      end
    end
  end
end
