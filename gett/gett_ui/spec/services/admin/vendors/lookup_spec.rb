require 'rails_helper'

RSpec.describe Admin::Vendors::Lookup, type: :service do
  let(:vendors) { ['Vendor One', 'Vendor Two', 'Vendor Three'] }

  subject(:service) { described_class.new }

  describe '#execute' do
    before do
      vendors.each do |vendor|
        booking = create(:booking, :ot, :billed)
        create(:booking_driver, vendor_name: vendor, booking: booking)
      end
    end

    it 'returns a list of all vendors' do
      expect(service.execute.result).to match_array(vendors)
    end
  end
end
