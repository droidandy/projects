require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Orders API' do
  path '/orders/{id}' do
    get 'Responds with order data' do
      tags 'Orders'

      consumes 'application/json'

      parameter name: :id,
                in: :path,
                type: :integer,
                description: 'Order ID',
                example: 123456

      let(:id) { 123456 }

      let(:body) { json_body('gett/finance_portal_api/order') }
      before(:each) {
        stub_client(FinancePortalApi::Client, :order, body)
      }

      user_authentication_required!

      response '200', 'successfully requested list of earnings' do
        schema '$ref' => '#/definitions/order'

        run_test!
      end
    end
  end
end
