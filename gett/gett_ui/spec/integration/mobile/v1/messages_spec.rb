require 'swagger_helper'

describe 'Messages API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:member_created_at) { DateTime.current }
  let(:member)            { create(:passenger, created_at: member_created_at) }
  let!(:push_message)     { create(:message, :push, recipient: member, created_at: member_created_at + 1.second) }
  let!(:personal_message) { create(:message, :personal, recipient: member, created_at: member_created_at + 2.seconds) }
  let!(:external_message) { create(:message, :external, created_at: member_created_at + 3.seconds) }

  let!(:old_push_message)     { create(:message, :push, recipient: member, created_at: member_created_at - 1.second) }
  let!(:old_personal_message) { create(:message, :personal, recipient: member, created_at: member_created_at - 2.seconds) }
  let!(:old_external_message) { create(:message, :external, created_at: member_created_at - 3.seconds) }

  let(:Authorization)     { JsonWebToken.encode(id: member.id) }

  path '/messages/recent' do
    get 'Shows list of last 100 messages (notifications)' do
      tags 'Messages (Notifications)'
      produces 'application/json'
      security [ api_key: [] ]

      response '200', 'list was successfully fetched' do
        schema(
          type: :object,
          properties: {
            items: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:         {type: :integer},
                  body:       {type: :string},
                  title:      {type: :string, 'x-nullable': true},
                  сreated_at: {type: :datetime},
                  booking_id: {type: :integer, 'x-nullable': true}
                },
                required: [:id, :body, :created_at]
              }
            }
          },
          required: [:items]
        )

        run_test! do
          data = JSON.parse(response.body, symbolize_names: true)

          expect(data[:items].pluck(:id)).to eq([external_message, personal_message, push_message].pluck(:id))
        end
      end
    end
  end
end
