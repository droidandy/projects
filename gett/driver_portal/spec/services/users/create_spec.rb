require 'rails_helper'

RSpec.describe Users::Create do
  describe '#execute!' do
    let(:current_user) { nil }
    subject { described_class.new(current_user, params) }

    context 'with minimum params' do
      let(:params) do
        {
          email: 'new@email.com',
          password: 'password',
          password_confirmation: 'password'
        }
      end

      it 'should create new user' do
        expect { subject.execute! }.to change { User.count }.by(1)
        expect(subject).to be_success
      end
    end

    context 'with all params' do
      let(:params) do
        {
          email: 'new@email.com',
          password: 'password',
          password_confirmation: 'password',
          account_number: 'account_number',
          active: false,
          address: 'address',
          badge_number: 'badge_number',
          badge_type: 'badge_type',
          city: 'city',
          gett_id: 1,
          is_frozen: true,
          license_number: 'license_number',
          name: 'first_name last_name',
          phone: 'phone',
          postcode: 'postcode',
          sort_code: 'sort_code'
        }
      end

      it 'should create new user' do
        expect { subject.execute! }.to change { User.count }.by(1)
        expect(subject).to be_success
      end
    end

    context 'with role' do
      let(:params) do
        {
          role: 'driver',
          email: 'new@email.com',
          password: 'password',
          password_confirmation: 'password'
        }
      end

      it 'should create new user' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.user.roles.map(&:name)).to include('driver')
      end

      context 'with apollo_driver role' do
        let(:params) do
          {
            role: 'apollo_driver',
            email: 'new@email.com',
            password: 'password',
            password_confirmation: 'password'
          }
        end

        it 'should have review' do
          subject.execute!
          expect(subject.user.reviews.count).to eq(1)
        end
      end
    end

    context 'with bad params' do
      let(:params) do
        {
          email: 'new@email.com'
        }
      end

      it 'should return model errors' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to include(:password)
      end
    end
  end
end
