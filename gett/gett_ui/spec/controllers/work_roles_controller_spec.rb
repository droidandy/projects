require 'rails_helper'

RSpec.describe WorkRolesController, type: :controller do
  let(:company)    { create :company }
  let(:admin)      { create :admin, company: company }
  let!(:work_role) { create :work_role, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: WorkRoles do
    get :index do
      stub_service(result: 'work roles list')

      expected_response(200 => 'work roles list')
    end

    get :new do
      let(:service_class) { WorkRoles::Form }

      stub_service(result: 'work roles form data')

      expected_response(200 => 'work roles form data')
    end

    post :create do
      params { { work_role: {name: 'role'} } }

      expected_service_attributes { { params: as_params(name: 'role') } }

      on_success do
        stub_service(show_result: 'work role values')
        expected_response(200 => 'work role values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :edit do
      let(:service_class) { WorkRoles::Form }

      params { { id: work_role.id } }

      expected_service_attributes { { work_role: work_role } }

      stub_service(result: 'work roles form data')

      expected_response(200 => 'work roles form data')
    end

    put :update do
      params { { id: work_role.id, work_role: {name: 'foo'} } }

      expected_service_attributes { { work_role: work_role, params: as_params(name: 'foo') } }

      on_success do
        stub_service(show_result: 'work role values')
        expected_response(200 => 'work role values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: work_role.id } }

      expected_service_attributes { { work_role: work_role } }

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
