require 'rails_helper'
require 'swagger_helper'
include ActionDispatch::TestProcess

RSpec.describe 'Documents API' do
  path '/session/documents' do
    post 'Creates new document for current user' do
      tags 'Documents'

      consumes 'multipart/form-data'

      parameter name: :kind,
                in: :formData,
                type: :string,
                description: 'Kind slug'
      parameter name: :file,
                in: :formData,
                type: :file,
                required: false

      user_authentication_required! current_user_traits: %i[with_driver_role]

      let(:kind) { create(:documents_kind, owner: :driver).slug }
      let(:file) { fixture_file_upload('pdf-sample.pdf') }

      response '200', 'successfully create document' do
        schema '$ref' => '#/definitions/document'

        run_test!
      end
    end
  end
end
