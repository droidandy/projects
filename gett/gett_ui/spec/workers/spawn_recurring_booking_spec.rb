require 'rails_helper'

RSpec.describe SpawnRecurringBooking, type: :worker do
  let(:booking) { create(:booking, :recurring) }
  let(:worker)  { SpawnRecurringBooking.new }

  it 'calls Shared::Bookings::CloneRecurring' do
    expect(Shared::Bookings::CloneRecurring).to receive(:new)
      .with(booking: booking)
      .and_return(double(execute: true))

    worker.perform(booking.id)
  end
end
