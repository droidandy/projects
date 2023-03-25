require 'rails_helper'

RSpec.describe Admin::Bookings::AuditLog do
  let(:booking)  { create :booking }
  let!(:service) { Admin::Bookings::AuditLog.new(booking: booking) }

  describe "#execute" do
    it 'succeeds' do
      expect(service.execute).to be_success
    end
  end
end
