require 'rails_helper'

RSpec.describe CompaniesController, type: :controller do
  let(:admin) { create :admin }

  it_behaves_like 'service controller', module: Companies do
    context 'without authentication' do
      post :create_signup_request do
        let(:request_params) do
          {
            user_name: 'Admin Lname',
            phone_number: '123phone',
            email: 'admin@test.com',
            name: 'New company',
            country: 'uk',
            comment: 'comment',
            accept_tac: 'true',
            accept_pp: 'true'
          }
        end

        params { { company: request_params } }

        expected_service_attributes { { params: as_params(request_params) } }

        on_success do
          stub_service(result: 'ok')
          expected_response(200)
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => { errors: 'errors' }.to_json)
        end
      end
    end

    context 'with authentication' do
      before { sign_in admin }

      get :show do
        let(:service_class) { Companies::Dashboard }

        stub_service(result: 'company settings values')

        expected_response(200 => 'company settings values')
      end

      put :update do
        params { { company: {logo: 'foo'} } }

        expected_service_attributes { { params: as_params(logo: 'foo') } }

        on_success do
          before do
            allow(Companies::Dashboard).to receive_message_chain(:new, :execute, :result)
              .and_return('dashboard_response')
          end

          expected_response(200 => 'dashboard_response')
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => { errors: 'errors' }.to_json)
        end
      end

      put :synchronize_sftp do
        stub_service(result: true)

        expected_response(200)
      end
    end
  end
end
