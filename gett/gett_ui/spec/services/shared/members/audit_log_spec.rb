require 'rails_helper'

RSpec.describe Shared::Members::AuditLog do
  let(:service_class) do
    Class.new(Shared::Members::AuditLog) do
      attributes :member
    end
  end
  let(:service) { service_class.new(member: member) }

  describe 'transformed values' do
    around(:each) do |example|
      Rails.application.config.sequel.audited_enabled = true
      example.run
      Rails.application.config.sequel.audited_enabled = false
    end

    describe 'onboarding' do
      subject { service.execute.result }

      context 'from nil to true' do
        let(:member) { create(:member, onboarding: nil) }

        before { member.update(onboarding: true) }

        it { is_expected.to include(hash_including(from: 'Off', to: 'Waiting for onboarding')) }
      end

      context 'from true to false' do
        let(:member) { create(:member, onboarding: true) }

        before { member.update(onboarding: false) }

        it { is_expected.to include(hash_including(from: 'Waiting for onboarding', to: 'Onboarded')) }
      end
    end
  end
end
