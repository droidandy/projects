require 'rails_helper'

RSpec.describe Bookings::Repeat, type: :service do
  let(:booking) { create(:booking, :without_passenger, :completed) }
  let(:service) { Bookings::Repeat.new(booking: booking) }
  let(:result)  { service.execute.result }

  service_context { { member: booking.booker, company: booking.booker.company, reincarnated?: false } }

  it { is_expected.to be_authorized_by(Bookings::FormPolicy) }

  it 'should have a reduced set of booking fields' do
    expect(result[:booking].keys).to match_array(%i(
      passenger_id service_type passenger_name passenger_phone pickup_address international_flag
      destination_address stops vehicle_value vehicle_name scheduled_type as_directed
      vehicle_vendor_id message flight travel_reason_id payment_type booker_id
    ))

    expect(result[:booking][:scheduled_type]).to eq 'now'
  end

  context 'when booking is not final' do
    let(:booking) { create(:booking, :without_passenger, :on_the_way) }

    it 'executes unsuccessfully' do
      expect(service.execute).not_to be_success
    end
  end
end
