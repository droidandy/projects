require 'rails_helper'

RSpec.describe Admin::Users::VerifyEmail, type: :service do
  describe '#execute' do
    let(:service) { Admin::Users::VerifyEmail.new(email: email) }

    context 'when front-office member with such email exists' do
      let(:company) { create(:company) }
      let(:member)  { create(:admin, company: company) }
      let(:email)   { member.email }

      before { service.execute }

      context 'existed back office user editing' do
        let(:user)    { create(:user, :admin) }
        let(:service) { Admin::Users::VerifyEmail.new(email: email, id: user.id) }

        it 'returns error, member already exists' do
          expect(service.result).to include(
            verified: false,
            error: kind_of(String)
          )
        end
      end

      context 'new back office user creating' do
        it 'returns information on existing member' do
          expect(service.result).to include(
            verified: true,
            member: a_hash_including(
              'email', 'company_id', 'first_name', 'last_name', 'phone', :member_role_type
            )
          )
        end
      end

      context 'when company is inactive' do
        let(:company) { create(:company, :inactive) }

        it 'returns error that email cannot be used' do
          expect(service.result).to include(
            verified: false,
            error: kind_of(String)
          )
        end
      end

      context 'when company is affiliate' do
        let(:company) { create(:company, :affiliate) }

        it 'returns error that email cannot be used' do
          expect(service.result).to include(
            verified: false,
            error: kind_of(String)
          )
        end
      end
    end

    context 'when back-office user with such email exists' do
      let(:user)  { create(:user, :admin) }
      let(:email) { user.email }

      it 'returns error on taken email' do
        expect(service.execute.result).to include(
          verified: false,
          error: kind_of(String)
        )
      end
    end

    context 'when email is free to use' do
      let(:email) { 'foo@bar.com' }

      it 'returns verified result' do
        expect(service.execute.result).to include(
          verified: true,
          message: kind_of(String)
        )
      end
    end

    describe 'downcasing value' do
      let!(:user) { create(:user, :admin, email: 'admin@email.com') }
      let(:email) { 'AdMiN@eMaIl.CoM' }

      it 'downcases value before checking' do
        expect(service.execute.result).to include(
          verified: false,
          error: kind_of(String)
        )
      end
    end
  end
end
