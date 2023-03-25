require 'swagger_helper'

describe 'Booking References API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:booking_reference) { create(:booking_reference, company: company) }
  let!(:reference_entry) do
    create(:reference_entry, booking_reference: booking_reference, value: 'full_term')
  end

  path '/booking_references/{booking_reference_id}/reference_entries' do
    get 'List of reference entries' do
      tags 'Booking References'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :booking_reference_id, in: :path, type: :integer
      parameter name: :search_term, in: :query, type: :string

      response '200', 'returns reference entries for related booking reference' do
        let(:booking_reference_id) { booking_reference.id }
        let(:search_term)          { 'term' }

        schema(
          type: :object,
          properties: {
            items: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:                   {type: :integer},
                  booking_reference_id: {type: :integer},
                  value:                {type: :string}
                }
              }
            }
          },
          required: ['items']
        )

        run_test!
      end
    end
  end
end
