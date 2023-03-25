require 'rails_helper'

RSpec.describe UserUnlocker, type: :worker do
  let(:worker)  { described_class.new }
  let!(:user)   { create(:user, locked: true, invalid_passwords_count: 20) }
  let(:subject) { user.reload }

  before { worker.perform(user.id) }

  it { is_expected.not_to be_locked }
  its(:invalid_passwords_count) { is_expected.to be_zero }
  its(:locks_count)             { is_expected.to be_zero }
end
