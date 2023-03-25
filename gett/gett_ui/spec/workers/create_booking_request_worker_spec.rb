require 'rails_helper'

RSpec.describe CreateBookingRequestWorker, type: :worker do
  let(:booking) { create(:booking) }
  let(:worker)  { CreateBookingRequestWorker.new }
  let(:metadata) { {} }

  it 'calls Bookings::CreateRequest' do
    expect(Bookings::CreateRequest).to receive(:new)
      .with(booking: booking, metadata: metadata)
      .and_return(double(execute: true))

    worker.perform(booking.id, metadata)
  end

  it 'rejects booking if all attempts failed' do
    msg = { 'queue' => nil, 'class' => 'CreateBookingRequestWorker', 'args' => [booking.id], 'error_message' => 'Message' }

    CreateBookingRequestWorker.within_sidekiq_retries_exhausted_block(msg) do
      expect(Bookings::ToCustomerCare).to receive(:new)
        .with(booking: booking, message: msg.to_s)
        .and_return(double(execute: true))

      expect(Alerts::Create).to receive(:new)
        .with(booking: booking, type: :api_failure)
        .and_return(double(execute: true))
    end
  end
end
