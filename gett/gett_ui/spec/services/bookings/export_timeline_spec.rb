require 'rails_helper'

RSpec.describe Bookings::ExportTimeline, type: :service do
  describe '#execute' do
    let(:booking) { create(:booking) }
    let(:service) { described_class.new(booking: booking) }

    before do
      expect(Bookings::Timeline).to receive(:new).with(booking: booking)
        .and_return(double(execute: double(result: :timeline_data)))

      expect(BookingsController).to receive(:render)
        .with(
          template: 'bookings/timeline',
          layout: false,
          assigns: {booking_data: :timeline_data}
        )
        .and_return('timeline html')

      expect(IMGKit).to receive(:new).with('timeline html', quality: 50)
        .and_return(double(to_img: 'imagebinary'))
    end

    it 'generates image binary' do
      expect(service.execute.result).to eq('imagebinary')
    end
  end
end
