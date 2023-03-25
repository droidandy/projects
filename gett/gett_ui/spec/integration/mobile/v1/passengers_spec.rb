require 'swagger_helper'

describe 'Passengers API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:passenger) { create(:passenger, company: user.company) }

  path '/passengers/{id}/edit' do
    get "Shows passenger's data" do
      tags 'Passengers'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer

      response '200', 'returns passenger data' do
        let(:id) { passenger.id }

        schema('$ref' => '#/definitions/show_passenger_response_schema')

        run_test!
      end
    end
  end

  path '/passengers/{id}' do
    put 'Update a passenger' do
      tags 'Passengers'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          passenger: {'$ref' => '#/definitions/passenger_update_schema' }
        },
        required: ['passenger']
      }

      let(:id) { passenger.id }
      let(:params) { { passenger: passenger_params } }

      response '200', 'updates passenger and returns empty body' do
        let(:passenger_params) do
          passenger.to_h.merge!(first_name: 'new_first_name')
        end

        run_test! do
          expect(passenger.first_name).to eq('new_first_name')
        end
      end

      response '422', 'unprocessable entity' do
        let(:passenger_params) do
          passenger.to_h.merge!(phone: 'abc')
        end

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end
end
