require 'rails_helper'

RSpec.describe UserDevice, type: :model do
  describe '.active' do
    let!(:active_device)   { create :user_device }
    let!(:inactive_device) { create :user_device, :inactive }

    subject { UserDevice.active.all }

    it { is_expected.to match_array [active_device] }
  end
end
