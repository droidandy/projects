require 'swagger_helper'

describe 'Passenger Payment Cards API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:company)   { create(:company, payment_types: %w(account passenger_payment_card)) }
  let(:passenger) { user }

  path '/passengers/{passenger_id}/payment_cards' do
    post "Creates passenger's payment card" do
      tags 'Passenger Payment Cards'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :passenger_id, in: :path, type: :integer
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          payment_card: {
            type: :object,
            properties: {
              personal:         {type: :boolean},
              card_number:      {type: :string},
              cvv:              {type: :string},
              holder_name:      {type: :string},
              expiration_month: {type: :integer},
              expiration_year:  {type: :integer}
            }
          }
        },
        required: ['payment_card']
      }

      let(:passenger_id) { passenger.id }
      let(:params)       { { payment_card: attributes_for(:payment_card) } }

      before do
        stub_request(:post, "https://api.paymentsos.com/tokens")
          .to_return(payment_token_response)
      end

      response '200', "creates new passenger payment card and returns it's data" do
        let(:payment_token_response) { { status: 200, body: {token: 'returned_token'}.to_json } }

        schema(
          type: :object,
          properties: {
            id:               {type: :integer},
            last_4:           {type: :string},
            holder_name:      {type: :string},
            expiration_month: {type: :integer},
            expiration_year:  {type: :integer},
            default:          {type: :boolean},
            kind:             {type: :string}
          }
        )

        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:payment_token_response) { { status: 422 } }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end

  path '/passengers/{passenger_id}/payment_cards/{id}' do
    delete "Delete passenger's payment card" do
      tags 'Passenger Payment Cards'
      security [ api_key: [] ]

      parameter name: :passenger_id, in: :path, type: :integer
      parameter name: :id, in: :path, type: :integer

      let(:payment_card) { create(:payment_card, passenger: passenger) }
      let(:passenger_id) { passenger.id }
      let(:id)           { payment_card.id }

      response '200', 'deactivates passenger payment card and returns empty body' do
        run_test! do
          expect(payment_card.reload.active).to be_falsey
        end
      end
    end
  end

  path '/passengers/{passenger_id}/payment_cards/{id}/make_default' do
    put "Make passenger's payment card default" do
      tags 'Passenger Payment Cards'
      security [ api_key: [] ]

      parameter name: :passenger_id, in: :path, type: :integer
      parameter name: :id, in: :path, type: :integer

      let(:payment_card) { create(:payment_card, passenger: passenger) }
      let(:passenger_id) { passenger.id }
      let(:id)           { payment_card.id }

      response '200', 'marks passenger payment card as default and returns empty body' do
        run_test! do
          expect(payment_card.reload.default).to be_truthy
        end
      end
    end
  end
end
