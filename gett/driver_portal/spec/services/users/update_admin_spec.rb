require 'rails_helper'

RSpec.describe Users::UpdateAdmin do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create :user, :with_site_admin_role }
    let(:user) { create :user, :with_driver_support_role }
    let(:active) { true }

    let(:params) do
      {
        user_id: user.id,
        role: 'site_admin',
        email: 'site@admin.com',
        first_name: 'Site',
        last_name: 'Admin',
        active: true
      }
    end

    it 'should pass valid params' do
      expect(Users::Update).to receive(:new)
        .with(
          current_user,
          {
            user: user,
            active: true,
            email: 'site@admin.com',
            name: 'Site Admin',
            role: 'site_admin'
          }
        )
        .and_return(instance_double(Users::Update, execute!: true, success?: true, updated_user: user))
      subject.execute!
    end

    context 'with invalid user data' do
      before(:each) do
        stub_service(Users::Update, false, updated_user: nil, errors: { a: :b })
        subject.execute!
      end

      it 'should not work' do
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ a: :b })
      end
    end

    context 'with valid user data' do
      before(:each) do
        stub_service(Users::Update, updated_user: user)
        subject.execute!
      end

      it 'should work' do
        expect(subject).to be_success
      end
    end
  end
end
