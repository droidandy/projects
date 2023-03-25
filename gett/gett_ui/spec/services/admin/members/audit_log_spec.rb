require 'rails_helper'

RSpec.describe Admin::Members::AuditLog do
  let(:member)  { create :booker }
  let(:service) { Admin::Members::AuditLog.new(member: member) }

  describe "#execute" do
    it 'succeeds' do
      expect(service.execute).to be_success
    end
  end
end
