require 'rails_helper'

RSpec.describe BookingsServiceJob, type: :job do
  let(:booking) { create(:booking) }

  subject { described_class.new }

  it 'performs class that was sended to service job as argument' do
    expect(ApplicationService::Context).to receive(:with_context)
      .with(company: booking.booker.company, user: booking.booker)
      .and_call_original
    expect(Bookings::CreateRequest).to receive(:new)
      .with(booking: booking)
      .and_return(double(execute: true))

    subject.perform(booking, 'Bookings::CreateRequest')
  end
end
