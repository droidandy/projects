require 'rails_helper'

RSpec.describe Bookings::Row, type: :service do
  describe '#execute' do
    let(:booking) { create(:booking) }
    let(:service) { described_class.new(booking: booking) }
    let(:static_map_result) { double(execute: double(result: 'static_map')) }

    before { allow(GoogleApi::MobileStaticMap).to receive(:new).and_return(static_map_result) }
    subject { service.execute.result.with_indifferent_access }

    it {
      is_expected.to include(
        :id, :service_id, :status, :payment_method, :scheduled_at, :fare_quote, :recurring_next,
        :service_type, :indicated_status, :timezone, :journey_type, :passenger, :phone, :passenger_avatar_url,
        :pickup_address, :destination_address, :vehicle_type, :payment_method_title, :final,
        :alert_level, :eta, :can
      )
    }

    it { is_expected.not_to include(:total_cost) }
    it { is_expected.not_to include(:static_map) }

    context 'when booking is completed' do
      let(:booking) { create(:booking, status: :completed) }

      it { is_expected.to include(:total_cost) }
    end

    context 'when :map_size attribute is passed' do
      let(:service) { described_class.new(booking: booking, map_size: '100x100') }

      it { is_expected.to include(:static_map) }
    end
  end
end
