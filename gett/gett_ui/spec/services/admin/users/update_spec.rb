require 'rails_helper'

RSpec.describe Admin::Users::Update, type: :service do
  describe '#execute' do
    let(:company) { create :company }
    let!(:admin)  { create :user, :superadmin }
    let!(:user)   { create :user, :admin, first_name: 'Name', email: 'old@email.com' }

    subject(:service) { described_class.new(user: user, params: params) }

    context 'updating back-office user' do
      context 'with valid params' do
        let(:params) do
          {
            email:          'new@email.com',
            first_name:     'John',
            last_name:      'Smith',
            user_role_name: 'admin'
          }
        end

        it 'updates email' do
          expect{ service.execute }.to change(user, :email).from('old@email.com').to('new@email.com')
        end

        it 'updates first_name' do
          expect{ service.execute }.to change(user, :first_name).from('Name').to('John')
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
        end
      end

      context 'with invalid params' do
        let(:params) { { email: '' } }

        specify { expect{ service.execute }.not_to change{ user.reload.email } }

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
        end
      end
    end

    context 'updating back-office user and creating member' do
      context 'with valid params' do
        let(:params) do
          {
            email:            'new@email.com',
            first_name:       'John',
            phone:            '+123123123123',
            member_role_type: 'booker',
            company_id:       company.id
          }
        end

        specify { expect{ service.execute }.not_to change(User, :count) }
        specify { expect{ service.execute }.to change(Member, :count).by(1) }
        specify { expect{ service.execute }.to change(user, :email).from('old@email.com').to('new@email.com') }
        specify { expect{ service.execute }.to change(user, :first_name).from('Name').to('John') }

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          it { expect(Member[user.id].role.name).to eq 'booker' }
          it { expect(Member[user.id].company.id).to eq company.id }
          it { expect(Member[user.id].phone).to eq '+123123123123' }
        end
      end

      context 'with invalid params' do
        let(:params) do
          {
            email:            '',
            first_name:       'John',
            phone:            '+123123123123',
            member_role_type: 'booker',
            company_id:       company.id
          }
        end

        it { expect{ service.execute }.not_to change(Member, :count) }
        it { expect{ service.execute }.not_to change{ user.reload.email } }
        it { expect{ service.execute }.not_to change{ user.reload.first_name } }

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
        end
      end
    end

    context 'updating back-office user that is companyadmin' do
      let!(:user) { create :companyadmin, company: company, first_name: 'Name', email: 'old@email.com' }

      context 'with valid params' do
        let(:params) { {email: 'new@email.com', member_role_type: 'admin'} }

        specify { expect{ service.execute }.not_to change(User, :count) }
        specify { expect{ service.execute }.not_to change(Member, :count) }
        specify { expect{ service.execute }.not_to change(user, :member_role_id) }
        specify { expect{ service.execute }.to change(user, :email).from('old@email.com').to('new@email.com') }

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          it { expect(user.reload.role.name).to eq 'companyadmin' }
        end
      end

      context 'enabling master token' do
        let(:params) do
          {email: 'new@email.com', member_role_type: 'admin', master_token_enabled: true}
        end

        specify { expect{ service.execute }.to change(ApiKey, :count).by(1) }

        it { expect(user.api_key).to be_nil }

        describe 'execution results' do
          before { service.execute }

          it { expect(user.api_key).to be_present }
        end
      end

      context 'disabling master token' do
        let(:params) do
          {email: 'new@email.com', member_role_type: 'admin', master_token_enabled: false}
        end
        let!(:api_key) { ApiKey.create(user: user) }

        specify { expect{ service.execute }.to change(ApiKey, :count).by(-1) }

        it { expect(user.api_key).to be_present }

        describe 'execution results' do
          before { service.execute }

          it { expect(user.reload.api_key).to be_nil }
        end
      end
    end
  end
end
