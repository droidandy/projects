require 'rails_helper'

RSpec.describe CsvReportsController, type: :controller do
  let(:company)     { create :company }
  let(:admin)       { create :admin, company: company }
  let!(:csv_report) { create :csv_report, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: CsvReports do
    get :index do
      stub_service(result: 'csv reports list')

      expected_response(200 => 'csv reports list')
    end

    get :new do
      let(:service_class) { CsvReports::Form }

      stub_service(result: 'csv reports form data')

      expected_response(200 => 'csv reports form data')
    end

    post :create do
      params { { csv_report: { name: 'report' } } }

      expected_service_attributes { { params: as_params(name: 'report') } }

      on_success do
        stub_service(show_result: 'csv report values')
        expected_response(200 => 'csv report values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => { errors: 'errors' }.to_json)
      end
    end

    get :edit do
      let(:service_class) { CsvReports::Form }

      params { { id: csv_report.id } }

      expected_service_attributes { { csv_report: csv_report } }

      stub_service(result: 'csv reports form data')

      expected_response(200 => 'csv reports form data')
    end

    put :update do
      params { { id: csv_report.id, csv_report: { name: 'new name' } } }

      expected_service_attributes { { csv_report: csv_report, params: as_params(name: 'new name') } }

      on_success do
        stub_service(show_result: 'csv report values')
        expected_response(200 => 'csv report values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: csv_report.id } }

      expected_service_attributes { { csv_report: csv_report } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
