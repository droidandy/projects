require 'swagger_helper'

describe 'Sessions API', swagger_doc: 'mobile/v1/swagger.json' do
  path '/user/forgot_password' do
    put 'Triggers forgot password email' do
      tags 'Current User'
      consumes 'application/json'

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          email: {type: 'string'}
        },
        required: ['email']
      }

      response '200', 'sends "Forgot Password" email and returns empty body' do
        let(:params) { { email: 'email@email.com' } }

        before { expect(Users::ForgotPassword).to receive(:new).with(email: 'email@email.com').and_call_original }

        run_test!
      end
    end
  end

  path '/user/pass_guide' do
    put 'Sets flag of passed tutorial to true' do
      tags 'Current User'
      security [ api_key: [] ]

      response '200', 'updates `guide_passed` flag on current member and returns empty body' do
        before do
          service = double
          expect(Members::PassGuide).to receive(:new).with(member: user).and_return(service)
          expect(service).to receive(:execute)
        end

        run_test!
      end
    end
  end
end
