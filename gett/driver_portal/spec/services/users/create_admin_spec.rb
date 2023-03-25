require 'rails_helper'

RSpec.describe Users::CreateAdmin do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create :user }
    let(:created_user) { create :user }
    let(:active) { true }

    let(:params) do
      {
        role: 'site_admin',
        email: 'site@admin.com',
        first_name: 'Site',
        last_name: 'Admin',
        active: true
      }
    end

    it 'should pass valid params' do
      allow(SecureRandom).to receive(:hex).and_return('abcd1234')
      expect(Users::Create).to receive(:new)
        .with(
          current_user,
          {
            active: true,
            email: 'site@admin.com',
            name: 'Site Admin',
            password_confirmation: 'abcd1234',
            password: 'abcd1234',
            role: 'site_admin'
          }
        )
        .and_return(instance_double(Users::Create, execute!: true, success?: true, user: created_user))
      subject.execute!
    end

    context 'with invalid user data' do
      before(:each) do
        stub_service(Users::Create, false, user: nil, errors: { a: :b })
        subject.execute!
      end

      it 'should not work' do
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ a: :b })
      end
    end

    context 'with valid user data' do
      before(:each) do
        stub_service(Users::Create, user: created_user)
        subject.execute!
      end

      it 'should work' do
        expect(subject).to be_success
      end
    end
  end
end
