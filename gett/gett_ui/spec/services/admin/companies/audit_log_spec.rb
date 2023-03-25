require 'rails_helper'

RSpec.describe Admin::Companies::AuditLog do
  let(:company)  { create :company }
  let!(:service) { Admin::Companies::AuditLog.new(company: company) }

  describe "#execute" do
    it 'succeeds' do
      expect(service.execute).to be_success
    end
  end
end
