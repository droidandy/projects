require 'rails_helper'

RSpec.describe Admin::Users::Form, type: :service do
  let(:service) { Admin::Users::Form.new(user: user) }
  let(:admin) { create :user, :admin }

  service_context { { admin: admin } }

  describe '#execute' do
    subject(:result) { service.execute.result.deep_symbolize_keys }

    context 'user is present' do
      let(:user) { create :user, :admin }

      it { is_expected.to include :user, :user_roles, :member_roles, :companies, :can }
      its([:user]) { is_expected.to include :id, :email, :first_name, :last_name }

      context 'when user is member' do
        let(:user) { create :member, :admin, user_role_id: Role[:admin].id }

        its([:user]) do
          is_expected.to include(
            :id, :email, :first_name, :last_name,
            :editable_member, :company_id, :phone, :member_role_type
          )
        end
        its([:can]) { is_expected.to eq(change_user_role: true, change_member_role: true, change_company: true) }

        context 'when user is companyadmin' do
          let(:user) { create :companyadmin, user_role_id: Role[:companyadmin].id }

          its([:can]) { is_expected.to eq(change_user_role: true, change_member_role: false, change_company: false) }
        end
      end

      context 'when user is not a member' do
        context 'when admin' do
          its([:user_roles]) { are_expected.to eq %w(admin sales customer_care outsourced_customer_care) }
        end

        context 'when superadmin' do
          let(:admin) { create :user, :superadmin }

          its([:user_roles]) { are_expected.to eq %w(superadmin admin sales customer_care outsourced_customer_care) }
        end

        context 'with same or lower rank' do
          let(:user) { create :user, :admin }

          its([:can]) { is_expected.to eq(change_user_role: true, change_member_role: true, change_company: true) }
        end

        context 'with higher rank' do
          let(:user) { create :user, :superadmin }

          its([:can]) { is_expected.to eq(change_user_role: false, change_member_role: false, change_company: true) }
        end
      end
    end

    context 'user is not present' do
      let(:user) { nil }

      it { is_expected.to include :user, :user_roles, :member_roles }
      its([:user]) { is_expected.to eq(user_role_name: :admin) }
    end
  end
end
