require 'rails_helper'

RSpec.describe Bookings::ToCustomerCare, type: :service do
  let(:booking) { create :booking, :creating }

  subject(:service) { described_class.new(booking: booking) }

  describe '#execute' do
    before { allow(Faye.bookings).to receive(:notify_update) }

    it 'updates booking status' do
      expect{ service.execute }.to change{ booking.status }
        .from('creating').to('customer_care')
    end

    context 'when api service failed' do
      before { expect_any_instance_of(described_class).to receive(:update_model).and_return(false) }

      it 'raises error' do
        service.execute
        expect(service.result).to be false
      end
    end
  end
end
