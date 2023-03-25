require 'rails_helper'

RSpec.describe Sessions::Onboard, type: :service do
  describe '#execute' do
    let(:member) { create :member, onboarding: true }

    subject(:service) { Sessions::Onboard.new(member: member) }

    specify { expect(service.execute).to be_success }
    specify { expect{ service.execute }.to change(member, :onboarding).from(true).to(false) }
  end
end
