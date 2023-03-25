require 'rails_helper'

RSpec.describe Companies::CreateSignupRequest, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:basic_params) do
        {
          name: 'New company',
          user_name: 'Admin Lname',
          phone_number: '123phone',
          email: 'admin@test.com',
          country: 'uk',
          comment: 'comment'
        }
      end

      context 'when terms are accepted' do
        let(:params) do
          basic_params.merge(accept_tac: true, accept_pp: true)
        end

        before do
          allow(CompanyMailer).to receive(:signup_request)
            .and_return(double(deliver_later: true))

          expect(CompanyMailer).to receive(:signup_request)
        end

        it 'creates SignupRequest' do
          expect{ service.execute }.to change(CompanySignupRequest, :count)
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }

          it "doesn't provides errors" do
            expect(service.errors).to be_empty
          end
        end
      end

      context 'when terms are not accepted' do
        let(:params) do
          basic_params.merge(accept_tac: true, accept_pp: false)
        end

        before do
          expect(CompanyMailer).not_to receive(:signup_request)
        end

        it "doesn't create SignupRequest" do
          expect{ service.execute }.not_to change(CompanySignupRequest, :count)
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
          it 'provide errors' do
            expect(service.errors).to eq 'You have to apply all policies'
          end
        end
      end
    end

    context 'with invalid params (no company name)' do
      let(:params) do
        {
          user_name: 'Admin Lname',
          phone_number: '123phone',
          email: 'admin@test.com',
          country: 'uk',
          accept_tac: true,
          accept_pp: true,
          comment: 'comment'
        }
      end

      before do
        expect(CompanyMailer).not_to receive(:signup_request)
      end

      it "doesn't create SignupRequest" do
        expect{ service.execute }.not_to change(CompanySignupRequest, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        it 'provide errors' do
          expect(service.errors).to be_present
        end
      end
    end
  end
end
