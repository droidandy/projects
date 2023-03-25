require 'rails_helper'

RSpec.describe Bookings::NotifyDriver, type: :service do
  let(:passenger) { create(:passenger, first_name: 'John') }
  let(:booking)   { create(:booking, :with_driver, passenger: passenger, service_id: 'service-id') }
  let(:service)   { Bookings::NotifyDriver.new(booking: booking, arrive_in: 5) }

  describe '#execute' do
    let(:driver_phone) { booking.driver.phone_number }

    before { allow(SmsSender).to receive(:perform_async) }

    it 'notifies driver with SMS' do
      expect(service).to receive(:sms_text).and_return('text')
      expect(service.execute).to be_success
      expect(SmsSender).to have_received(:perform_async).with(driver_phone, 'text')
    end

    describe 'message content' do
      before { service.execute }

      it 'sends message containing passenger fist name' do
        expect(SmsSender).to have_received(:perform_async).with(driver_phone, a_string_including('John'))
      end

      it 'sends message containing booking service_id' do
        expect(SmsSender).to have_received(:perform_async).with(driver_phone, a_string_including('service-id'))
      end
    end
  end
end
