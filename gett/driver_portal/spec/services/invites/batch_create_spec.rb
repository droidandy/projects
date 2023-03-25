require 'rails_helper'

RSpec.describe Invites::BatchCreate do
  subject { described_class.new(current_user, args) }

  let(:current_user) { create(:user, :with_site_admin_role) }
  let(:user_ids) { [1, 2] }

  let(:args) do
    {
      user_ids: user_ids
    }
  end

  describe 'execute!' do
    it 'invokes invite sending' do
      expect(Invites::Create).to receive(:new)
        .twice
        .and_return(double(Invites::Create, execute!: true, success?: true))
      subject.execute!
    end

    it 'returns successfully sent invites count' do
      stub_service(Invites::Create)
      subject.execute!
      expect(subject.succeeded_ids).to eq(user_ids)
      expect(subject.failed_ids).to eq([])
    end

    it 'returns failed invitations count' do
      stub_service(Invites::Create, false)
      subject.execute!
      expect(subject.failed_ids).to eq(user_ids)
      expect(subject.succeeded_ids).to eq([])
    end
  end
end
