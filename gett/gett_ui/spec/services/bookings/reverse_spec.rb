require 'rails_helper'

RSpec.describe Bookings::Reverse, type: :service do
  let(:booking) { create(:booking, :without_passenger, :completed) }
  let(:service) { Bookings::Reverse.new(booking: booking) }
  let(:result)  { service.execute.result }

  service_context { { member: booking.booker, company: booking.booker.company, reincarnated?: false } }

  it { is_expected.to be_authorized_by(Bookings::FormPolicy) }

  it 'should have a reduced set of booking fields' do
    expect(result[:booking][:destination_address]['line']).to eq booking.pickup_address.line
    expect(result[:booking][:pickup_address]['line']).to eq booking.destination_address.line
    expect(result[:booking][:stops]).to eq booking.stop_addresses
    expect(result[:booking][:scheduled_type]).to eq 'now'
  end
end
