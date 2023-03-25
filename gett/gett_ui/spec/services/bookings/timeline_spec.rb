require 'rails_helper'

RSpec.describe Bookings::Timeline, type: :service do
  describe '#execute' do
    let(:booking) { create :booking }
    let(:service) { Bookings::Timeline.new(booking: booking) }

    subject { service.execute.result.with_indifferent_access }

    it { is_expected.to include(:id, :service_id, :status, :service_type, :events, :travel_distance) }
  end
end
