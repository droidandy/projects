require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Documents API' do
  path '/users/{user_id}/vehicles/{vehicle_id}/documents/{id}/approve' do
    post 'Approve given document and save metadata' do
      tags 'Documents'

      consumes 'application/json'

      parameter name: :user_id, in: :path
      parameter name: :vehicle_id, in: :path
      parameter name: :id, in: :path
      parameter name: :metadata,
        in: :body,
        description: 'Document metadata',
        schema: {
          type: :object,
          properties: {
            metadata: {
              type: :object
            }
          }
        }

      user_authentication_required! current_user_traits: %i[with_site_admin_role]

      let(:user) { create(:user) }
      let(:user_id) { user.id }
      let(:vehicle) { create(:vehicle, user: user) }
      let(:vehicle_id) { vehicle.id }
      let(:id) { create(:document, user: user, vehicle: vehicle).id }

      let(:metadata) do
        {
          metadata: {
            attr_1: 'value'
          }
        }
      end

      response '200', 'successfully approve document' do
        schema '$ref' => '#/definitions/document'

        run_test!
      end
    end
  end
end
