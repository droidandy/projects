require 'rails_helper'

RSpec.describe Bookings::CancellationReason, type: :service do
  it { is_expected.to be_authorized_by(Bookings::CancellationReasonPolicy) }

  describe '#execute' do
    service_context { { member: booking.passenger } }

    let(:booking) { create(:booking, :cancelled) }
    let(:cancellation_reason) { 'mistaken_order' }

    subject(:service) do
      Bookings::CancellationReason.new(booking: booking, reason: cancellation_reason)
    end

    it { expect(service.execute).to be_success }
    it { expect{ service.execute }.to change{ booking.cancellation_reason }.to(cancellation_reason) }

    context 'booking is not cancelled' do
      let(:booking) { create(:booking, :completed) }

      it { expect(service.execute).not_to be_success }
    end
  end
end
