require 'rails_helper'

RSpec.describe Admin::InvoicesController, type: :controller do
  let(:admin)   { create :user, :admin }
  let(:invoice) { create :invoice }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Invoices do
    get :index do
      params { { query: {} } }
      stub_service(result: 'invoices list')

      expected_response(200 => 'invoices list')
    end

    post :mark_as_paid do
      params { { id: invoice.id, partial_pay_amount: 123 } }

      expected_service_attributes { { invoice: invoice, partial_pay_amount: '123' } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end

    put :update do
      params { { id: invoice.id, invoice: { under_review: true } } }

      expected_service_attributes { { invoice: invoice, params: as_params(under_review: 'true') } }

      on_success do
        stub_service(show_result: 'show invoice')
        expected_response(200 => 'show invoice')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    post :export do
      let(:service_class) { ::Invoices::Export }

      params { { id: invoice.id } }
      expected_service_attributes { { invoice: invoice } }
      stub_service(result: 'some data')

      expected_response(200 => 'some data')
    end

    get :exportable_periods do
      stub_service(result: 'some periods')

      expected_response(200 => 'some periods')
    end

    post :export_bunch do
      params { { periods: ['period'] } }
      expected_service_attributes { { periods: ['period'] } }

      expected_response(200)
    end

    post :credit_note do
      let(:service_class) { ::Admin::Invoices::IssueCreditNote }

      let(:invoice) { create(:invoice) }
      params do
        {
          id: invoice.id,
          credit_note: {
            credit_note_lines: [{ booking_id: 1, amount: 100, vatable: false }]
          }
        }
      end

      expected_service_attributes do
        {
          invoice: invoice,
          credit_note_lines: [as_params(booking_id: '1', amount: '100', vatable: 'false')]
        }
      end

      stub_service(success?: true)

      expected_response(200)
    end

    post :apply_credit_note do
      let(:service_class) { ::Admin::Invoices::ApplyCreditNote }

      let(:invoice) { create(:credit_note) }

      params { { id: invoice.id } }

      expected_service_attributes { { invoice: invoice } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end

    delete :destroy do
      let(:service_class) { ::Admin::Invoices::Destroy }
      let(:invoice) { create(:credit_note) }

      params { { id: invoice.id } }
      expected_service_attributes { { invoice: invoice } }
      stub_service(success?: true)
      expected_response(204)
    end
  end
end
