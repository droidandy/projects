require 'rails_helper'

RSpec.describe Members::PassGuide do
  describe '#execute' do
    let(:member)  { create(:member) }
    let(:service) { Members::PassGuide.new(member: member) }

    it 'executes' do
      service.execute
      expect(service).to be_success
    end

    it 'sets guide_passed to true' do
      expect{ service.execute }.to change{ member.guide_passed }.from(false).to(true)
    end
  end
end
