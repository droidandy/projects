require 'rails_helper'

RSpec.describe Admin::Bookings::Row, type: :service do
  describe '#execute' do
    let(:booking) { create(:booking) }
    let(:service) { described_class.new(booking: booking) }

    subject { service.execute.result.with_indifferent_access }

    it {
      is_expected.to include(
        :id, :service_id, :status, :payment_method, :scheduled_at, :fare_quote, :recurring_next,
        :service_type, :indicated_status, :timezone, :journey_type, :passenger, :passenger_avatar_url,
        :pickup_address, :destination_address, :vehicle_type, :payment_method_title, :final,
        :alert_level, :eta, :company_name, :company_id, :passenger_id, :labels, :vendor_name
      )
    }

    it { is_expected.not_to include(:total_cost) }

    context 'with charges' do
      let(:service) { described_class.new(booking: booking, with_charges: true) }

      it { is_expected.to include(:charges) }
    end
  end
end
