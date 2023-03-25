require 'rails_helper'

RSpec.describe Invites::Decode do
  subject { described_class.new(args) }

  let(:args) do
    {
      token: token
    }
  end

  let(:user) { create(:user, :with_driver_role) }
  let(:admin) { create(:user, :with_site_admin_role) }

  let(:creation_service) do
    service = Invites::Create.new(admin, user_id: user.id)
    service.execute!

    raise 'Something went wrong with token creation' unless service.success?

    service
  end

  let(:invite) { creation_service.invite }
  let(:token) { creation_service.token }

  describe '#execute' do
    it 'looks for invite' do
      subject.execute!
      expect(subject.invite).to eq(invite)
    end

    it 'success' do
      subject.execute!
      expect(subject.success?).to be true
    end

    context 'when invite has epxired' do
      before do
        invite.update!(expires_at: Time.current - 1.day)
      end

      it 'fails' do
        subject.execute!
        expect(subject.fail?).to be true
      end
    end

    context 'when invite has been accepted already' do
      before do
        invite.accepted_step!
      end

      it 'fails' do
        subject.execute!
        expect(subject.fail?).to be true
      end
    end
  end
end
