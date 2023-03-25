require 'rails_helper'

RSpec.describe Users::BatchDeactivate do
  subject { described_class.new(current_user, args) }

  let(:current_user) { create(:user, :with_site_admin_role) }

  let(:args) do
    {
      user_ids: [1, 2]
    }
  end

  describe 'execute!' do
    it 'invokes user activation' do
      expect(Users::Deactivate).to receive(:new)
        .twice
        .and_return(double(Users::Deactivate, execute!: true, success?: true))
      subject.execute!
    end

    it 'returns successfully sent invites count' do
      stub_service(Users::Deactivate)
      subject.execute!
      expect(subject.succeeded_ids).to eq([1, 2])
      expect(subject.failed_ids).to eq([])
      expect(subject.skipped_ids).to eq([])
    end

    it 'returns failed invitations count' do
      stub_service(Users::Deactivate, false, user: instance_double(User, active?: true))
      subject.execute!
      expect(subject.succeeded_ids).to eq([])
      expect(subject.failed_ids).to eq([1, 2])
      expect(subject.skipped_ids).to eq([])
    end

    it 'returns skipped invitations count' do
      stub_service(Users::Deactivate, false, user: instance_double(User, active?: false))
      subject.execute!
      expect(subject.succeeded_ids).to eq([])
      expect(subject.failed_ids).to eq([])
      expect(subject.skipped_ids).to eq([1, 2])
    end
  end
end
