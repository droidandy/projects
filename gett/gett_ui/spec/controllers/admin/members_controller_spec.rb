require 'rails_helper'

RSpec.describe Admin::MembersController, type: :controller do
  let(:company) { create :company }
  let(:admin)   { create :user, :admin }
  let!(:member) { create :booker, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Members do
    get :index do
      stub_service(result: 'members list')

      expected_response(200 => 'members list')
    end

    get :stats do
      params { { id: member.id } }

      expected_service_attributes { { member: member } }
      stub_service(result: 'member stats')

      expected_response(200 => 'member stats')
    end

    get :edit do
      let(:service_class) { Admin::Members::Form }

      params { { id: member.id } }

      expected_service_attributes { { member: member } }

      stub_service(result: 'bookers form data')

      expected_response(200 => 'bookers form data')
    end

    put :update do
      params { { id: member.id, user: {first_name: 'foo'} } }

      expected_service_attributes { { member: member, params: as_params(first_name: 'foo') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :log do
      let(:service_class) { Admin::Members::AuditLog }

      params { { id: member.id } }

      expected_service_attributes { { member: member } }

      stub_service(result: 'member change log')

      expected_response(200 => 'member change log')
    end

    put :reinvite do
      let(:service_class) { ::Members::Reinvite }

      params { { id: member.id } }

      expected_service_attributes { { member: member } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end

    put :update_password do
      let(:service_class) { ::Users::UpdatePassword }
      let(:service) { service_class.new(params: params) }

      before { allow_any_instance_of(service_class).to receive(:with_context).with(any_args).and_return(service) }

      params { { id: member.id, user: { password: '1', password_confirmation: '1' }} }

      expected_service_attributes { { params: as_params(password: '1', password_confirmation: '1') } }

      on_success do
        stub_service(result: 'bookers form data')
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :log do
      let(:service_class) { Admin::Members::AuditLog }

      params { { id: member.id } }

      expected_service_attributes { { member: member } }

      stub_service(result: 'member change log')

      expected_response(200 => 'member change log')
    end
  end
end
