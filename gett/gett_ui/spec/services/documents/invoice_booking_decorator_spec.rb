require 'rails_helper'

RSpec.describe Documents::InvoiceBookingDecorator do
  let(:address) { create(:address, :baker_street) }
  let(:booking) { create(:booking, pickup_address: address) }
  subject(:decorator) { described_class.new(booking) }

  describe 'waypoints' do
    before do
      booking.booking_addresses.each { |ba| ba.update(passenger_address_type: 'home') }
      allow(HomePrivacy).to receive(:sanitize?).and_return(true)
    end

    it 'sanitizes home address' do
      expect(decorator.waypoints.first).to eq('Home')
    end
  end

  describe 'scheduled_at' do
    before do
      booking.update(scheduled_at: '2018-10-10 10:10:10')
    end

    it "displays scheduled_at in booking's time zone" do
      expect(decorator.scheduled_at_time).to eq('11:10 am')
    end
  end
end
