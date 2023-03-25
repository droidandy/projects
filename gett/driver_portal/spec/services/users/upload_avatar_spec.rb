require 'rails_helper'
require 'support/shared_examples/service_examples'
include ActionDispatch::TestProcess

RSpec.describe Users::UploadAvatar do
  describe '#execute!' do
    subject { described_class.new(current_user, admin, params) }
    let(:current_user) { create(:user, :with_apollo_driver_role) }
    let(:admin) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        avatar: fixture_file_upload('1x1.jpg', 'image/jpeg')
      }
    end

    include_examples 'it uses policy', UserPolicy, :upload_avatar?

    it 'updates user' do
      expect { subject.execute! }.to change { current_user.reload.avatar }
      expect(subject).to be_success
      expect(subject.avatar_url).to eq(current_user.avatar.full_url)
    end
  end
end
