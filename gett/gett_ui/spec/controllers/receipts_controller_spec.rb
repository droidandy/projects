require 'rails_helper'

RSpec.describe ReceiptsController, type: :controller do
  let(:admin) { create(:admin) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Bookings::Receipts do
    get :export_data do
      stub_service(result: 'users and periods')

      expected_response(200 => 'users and periods')
    end

    post :export do
      let(:service_class) { ::Bookings::Receipts::ExportBunch }

      params { {passenger_id: '1', periods: ['period']} }

      expected_service_attributes { {passenger_id: '1', periods: ['period']} }

      expected_response(200)
    end
  end
end
