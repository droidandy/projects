require 'rails_helper'

RSpec.describe DepartmentsController, type: :controller do
  let(:company)     { create :company }
  let(:admin)       { create :admin, company: company }
  let!(:department) { create :department, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Departments do
    get :index do
      stub_service(result: 'departments list')

      expected_response(200 => 'departments list')
    end

    get :new do
      let(:service_class) { Departments::Form }

      stub_service(result: 'departments form data')

      expected_response(200 => 'departments form data')
    end

    post :create do
      params { { department: {name: 'department'} } }

      expected_service_attributes { { params: as_params(name: 'department') } }

      on_success do
        stub_service(show_result: 'department values')
        expected_response(200 => 'department values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :edit do
      let(:service_class) { Departments::Form }

      params { { id: department.id } }

      expected_service_attributes { { department: department } }

      stub_service(result: 'departments form data')

      expected_response(200 => 'departments form data')
    end

    put :update do
      params { { id: department.id, department: {name: 'foo'} } }

      expected_service_attributes { { department: department, params: as_params(name: 'foo') } }

      on_success do
        stub_service(show_result: 'department values')
        expected_response(200 => 'department values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: department.id } }

      expected_service_attributes { { department: department } }

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
