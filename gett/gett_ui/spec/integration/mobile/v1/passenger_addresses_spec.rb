require 'swagger_helper'

describe 'Passenger Addresses API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:passenger)         { create(:passenger, company: user.company) }
  let(:passenger_address) { create(:passenger_address, passenger: passenger) }

  path '/passengers/{passenger_id}/addresses' do
    post "Creates passenger's address" do
      tags 'Passenger Addresses'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :passenger_id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          passenger_address: { '$ref' => '#/definitions/passenger_address_schema' }
        },
        required: ['passenger_address']
      }

      let(:passenger_id) { passenger.id }
      let(:params)       { { passenger_address: passenger_address_params } }

      response '200', "returns passenger's addresses" do
        let(:passenger_id) { passenger.id }
        let(:passenger_address_params) do
          attributes_for(:passenger_address, address: attributes_for(:address))
        end

        # TODO: add 'required' to `/address/airport` property
        schema('$ref' => '#/definitions/passenger_address_schema')

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:passenger_address_params) { attributes_for :passenger_address }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end

  path '/passengers/{passenger_id}/addresses/{id}' do
    put "Update passenger's address" do
      tags 'Passenger Addresses'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :passenger_id, in: :path, type: :integer
      parameter name: :id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          passenger_address: { '$ref' => '#/definitions/passenger_address_schema' }
        },
        required: ['passenger_address']
      }
      let(:passenger_id) { passenger.id }
      let(:id)           { passenger_address.id }
      let(:params)       { { passenger_address: passenger_address_params } }

      response '200', "updates passenger address and returns it's data" do
        let(:passenger_id) { passenger.id }
        let(:passenger_address_params) do
          attributes_for(:passenger_address, address: attributes_for(:address))
        end

        schema('$ref' => '#/definitions/passenger_address_schema')

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:passenger_address_params) { attributes_for :passenger_address }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end

    delete "Delete passenger's address" do
      tags 'Passenger Addresses'
      security [ api_key: [] ]

      parameter name: :passenger_id, in: :path, type: :integer
      parameter name: :id, in: :path, type: :integer

      let(:passenger_id) { passenger.id }
      let(:id)           { passenger_address.id }

      response '200', 'deletes passenger address and returns empty body' do
        run_test!
      end
    end
  end
end
