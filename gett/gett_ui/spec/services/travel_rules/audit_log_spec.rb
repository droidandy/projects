require 'rails_helper'

RSpec.describe TravelRules::AuditLog do
  let(:travel_rule) { create :travel_rule }
  let(:service)     { TravelRules::AuditLog.new(travel_rule: travel_rule) }

  describe "#execute" do
    it 'succeeds' do
      expect(service.execute).to be_success
    end
  end
end
