require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Statistics API' do
  path '/statistics/monthly/{type}' do
    get 'Responds with monthly statistics values' do
      tags 'Statistics'

      consumes 'application/json'

      parameter name: :type,
                in: :path,
                type: :string,
                enum: %w[active_users login_count]
      parameter name: :from,
                in: :query,
                type: :string,
                format: 'date',
                example: '2017-10-25',
                description: 'Use YYYY-MM-DD format'
      parameter name: :to,
                in: :query,
                type: :string,
                format: 'date',
                example: '2017-11-12',
                description: 'Use YYYY-MM-DD format'

      let(:from) { '2017-12-02' }
      let(:to) { '2017-12-05' }
      let(:type) { 'active_users' }
      let!(:entries) { create_list :statistics_entry, 5, start_point: Date.parse('2017-12-01') }

      user_authentication_required!

      response '200', 'successfully requested monthly statistics' do
        schema type: :object, properties: {
          entries: {
            type: :array,
            items: {
              type: :object,
              properties: {
                month: {
                  type: :integer
                },
                year: {
                  type: :integer
                },
                amount: {
                  type: :integer
                }
              }
            }
          }
        }

        run_test!
      end
    end
  end
end
