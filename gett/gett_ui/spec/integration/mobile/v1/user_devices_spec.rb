require 'swagger_helper'

describe 'User Devices API', swagger_doc: 'mobile/v1/swagger.json' do
  before { ApplicationService::Context.set_context!(user: user) }

  path '/user_devices' do
    post 'Create user device' do
      tags 'User Devices'
      consumes 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          device_token: {type: :string},
          uuid: {type: :string},
          device_type: {type: :string},
          os_type: {type: :string},
          client_os_version: {type: :string},
          device_network_provider: {type: :string}
        },
        required: ['device_token', 'uuid', 'device_type', 'os_type', 'client_os_version', 'device_network_provider']
      }

      response '200', 'creates new user device and returns empty body' do
        let(:params) do
          {
            device_token: SecureRandom.hex,
            uuid: SecureRandom.hex,
            device_type: SecureRandom.hex,
            os_type: SecureRandom.hex,
            client_os_version: SecureRandom.hex,
            device_network_provider: SecureRandom.hex
          }
        end

        run_test!
      end
    end

    delete 'Delete user device' do
      tags 'User Devices'
      consumes 'application/json'
      security [ api_key: [] ]
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          device_token: {type: :string}
        },
        required: ['device_token']
      }

      response '200', 'deletes existing user device and returns empty body' do
        let(:user_device) { create(:user_device, user: user) }
        let(:params)      { { device_token: user_device.token } }

        run_test!
      end
    end
  end
end
