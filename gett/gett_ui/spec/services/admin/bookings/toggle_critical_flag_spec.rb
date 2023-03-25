require 'rails_helper'

RSpec.describe Admin::Bookings::ToggleCriticalFlag, type: :service do
  let(:admin)   { create(:admin) }
  let(:booking) { create(:booking, critical_flag: critical_flag) }

  service_context { {admin: admin} }

  subject(:service) { described_class.new(booking: booking) }

  describe '#execute' do
    context 'booking is not critical yet' do
      let(:critical_flag) { false }

      specify { expect{ service.execute }.to change{ booking.critical_flag }.from(false).to(true) }
    end

    context 'booking is not critical yet' do
      let(:critical_flag) { true }

      specify { expect{ service.execute }.to change{ booking.critical_flag }.from(true).to(false) }
    end
  end
end
