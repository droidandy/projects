require 'rails_helper'

RSpec.describe InvoicePaymentsController, type: :controller do
  let(:company)  { create :company }
  let(:admin)    { create :admin, company: company }
  let(:invoices) { create_list :invoice, 2, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: InvoicePayments do
    post :create do
      let(:service_class) { InvoicePayments::CreateManual }

      let(:card_params) do
        {
          token: 'token123',
          holder_name: 'John Doe'
        }
      end

      params { { payment: {invoice_ids: invoices.map(&:id), payment_card: card_params} } }

      expected_service_attributes { { invoice_ids: invoices.map(&:id).map(&:to_s), card_token: 'token123' } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
