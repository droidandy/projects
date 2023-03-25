require 'rails_helper'

RSpec.describe Admin::Bookings::PricingUpdate, type: :service do
  subject(:service) do
    described_class.new(booking: booking, params: {
      booking: booking_params,
      charges: charges_params
    })
  end
  let(:booking_params) { {status: 'cancelled'} }

  context 'billed booking' do
    let(:booking) { create(:booking, :billed, status: 'completed') }
    let(:charges_params) { {} }

    it 'does not update booking' do
      expect { service.execute }.to_not change{ booking.reload.status }
    end
  end

  context 'non-billed booking' do
    let(:pickup) { create(:address, country_code: 'GB') }
    let(:booking) { create(:booking, status: 'completed', pickup_address: pickup) }

    let(:charges_params) { { cancellation_fee: 1, run_in_fee: 20 } }

    it 'updates booking and charges' do
      expect(service.execute).to be_success
      expect(booking.status).to eq('cancelled')
      charges = booking.charges
      expect(charges.values).to include(
        cancellation_fee: 100,
        vat: 20,
        total_cost: 120,
        run_in_fee: 0,
        manual: true
      )
    end
  end
end
