require 'rails_helper'

RSpec.describe Admin::Users::Create, type: :service do
  describe '#execute' do
    let(:company) { create :company }
    let!(:admin)  { create :user, :admin }

    subject(:service) { Admin::Users::Create.new(params: params) }

    context 'without creating member' do
      context 'with valid params' do
        let(:params) do
          {
            email:          'booker@email.com',
            first_name:     'John',
            last_name:      'Smith',
            user_role_name: 'admin'
          }
        end

        it { expect{ service.execute }.to change(User, :count).by(1) }

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:user) { is_expected.to be_persisted }
          its('user.user_role.name') { is_expected.to eq 'admin' }
        end
      end

      context 'with invalid params' do
        let(:params) do
          {
            first_name:     'John',
            last_name:      'Smith',
            user_role_name: 'admin'
          }
        end

        it { expect{ service.execute }.not_to change(User, :count) }

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
          its(:user) { is_expected.not_to be_persisted }
        end
      end
    end

    context 'with creating member' do
      context 'with valid params' do
        let(:params) do
          {
            email:            'booker@email.com',
            first_name:       'John',
            last_name:        'Smith',
            user_role_name:   'admin',
            company_id:       company.id,
            member_role_type: 'passenger',
            phone:            '+123123123123'
          }
        end

        it 'creates new User, Member' do
          expect{ service.execute }.to change_counts_by(
            User => 1,
            Member => 1
          )
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:member)                 { is_expected.to be_persisted }
          its('member.role.name')      { is_expected.to eq 'passenger' }
          its('member.user_role.name') { is_expected.to eq 'admin' }
          its('member.company')        { is_expected.to eq company }
        end
      end

      context 'with invalid params' do
        let(:params) do
          {
            email:            'booker@email.com',
            first_name:       'John',
            last_name:        'Smith',
            user_role_name:   'admin',
            member_role_type: 'passenger',
            company_id:       company.id
          }
        end

        it 'not creates new User, Member' do
          expect{ service.execute }.to change_counts_by(
            User => 0,
            Member => 0
          )
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
          its(:member) { is_expected.not_to be_persisted }
        end
      end
    end

    context 'when creating admin for existed member' do
      let!(:member) { create :passenger, company: company, email: 'new_user@email.com' }

      context 'with valid params' do
        let(:params) do
          {
            email:            'new_user@email.com',
            user_role_name:   'superadmin',
            member_role_type: member.role_name
          }
        end

        it 'does not create new User, Member' do
          expect{ service.execute }.to change_counts_by(
            User => 0,
            Member => 0
          )
        end

        it 'updates user_role_id' do
          expect{ service.execute }.to change{ member.reload.user_role_id }.from(nil)
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:member)                 { is_expected.to be_persisted }
          its('member.user_role.name') { is_expected.to eq 'superadmin' }
        end
      end

      context 'with invalid params' do
        let(:params) do
          {
            email:            'new_user@email.com',
            user_role_name:   'wrong_role',
            member_role_type: member.role_name
          }
        end

        it 'does not create new User, Member' do
          expect{ service.execute }.to change_counts_by(
            User => 0,
            Member => 0
          )
        end

        it 'does not update user_role_id' do
          expect{ service.execute }.not_to change{ member.reload.user_role_id }
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
          its(:member)            { is_expected.to be_persisted }
          its('member.user_role') { is_expected.to eq nil }
        end
      end
    end
  end
end
