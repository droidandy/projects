require 'rails_helper'

RSpec.describe Manual::Base, type: :service do
  let(:booking) { build(:booking, vehicle: create(:vehicle, :manual)) }

  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    it 'yield given block with http-callbacks' do
      expect { |b| service.execute!(&b) }.to yield_with_args(ApplicationService::HttpCallbacks)
    end
  end
end
