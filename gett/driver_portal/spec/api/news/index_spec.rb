require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news' do
    get 'Responds with list of news items' do
      tags 'News'

      consumes 'application/json'

      parameter name: :sort_column,
        in: :query,
        type: :string,
        enum: News::Items::Search::SORTABLE_COLUMNS
      parameter name: :sort_direction,
        in: :query,
        type: :string,
        enum: %w[asc desc]

      paginatable!

      user_authentication_required!
      let(:sort_column) { 'trending_index' }
      let(:sort_direction) { 'asc' }

      let!(:news_items) { create_list(:news_item, 3) }

      response '200', 'successfully requested list of news' do
        schema type: :object, properties: {
          news: {
            type: :array,
            items: {
              '$ref' => '#/definitions/news_item'
            }
          },
          total: {
            type: :integer,
            example: 11
          },
          page: {
            type: :integer,
            example: 1
          },
          per_page: {
            type: :integer,
            example: 5
          }
        }

        run_test!
      end
    end
  end
end
