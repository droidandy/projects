require 'rails_helper'
require 'swagger_helper'
include ActionDispatch::TestProcess

RSpec.describe 'Vehicles API' do
  path '/session/vehicles/{vehicle_id}/documents' do
    post 'Creates new document for given vehicle' do
      tags 'Vehicles'

      consumes 'multipart/form-data'

      parameter name: :vehicle_id, in: :path
      parameter name: :kind,
                in: :formData,
                type: :string,
                description: 'Kind slug'
      parameter name: :file,
                in: :formData,
                type: :file,
                required: false

      user_authentication_required! current_user_traits: %i[with_driver_role]

      let(:vehicle_id) { create(:vehicle, user: current_user).id }
      let(:kind) { create(:documents_kind, owner: :vehicle).slug }
      let(:file) { fixture_file_upload('pdf-sample.pdf') }

      response '200', 'successfully create document' do
        schema '$ref' => '#/definitions/document'

        run_test!
      end
    end
  end
end
