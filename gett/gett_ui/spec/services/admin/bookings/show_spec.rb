require 'rails_helper'

RSpec.describe Admin::Bookings::Show, type: :service do
  describe '#execute' do
    let(:booking) { create(:booking) }
    let(:service) { Admin::Bookings::Show.new(booking: booking) }

    subject(:result) { service.execute.result.with_indifferent_access }

    it {
      is_expected.to include(
        :id, :service_id, :message, :flight, :status, :payment_method, :scheduled_at,
        :service_type, :message_to_driver, :passenger, :passenger_avatar_url, :phone,
        :pickup_address, :destination_address, :stop_addresses, :vehicle_type, :booker,
        :travel_reason, :references, :channel, :final, :driver_details, :can, :path, :events,
        :booker_phone, :travel_distance, :company_name, :company_id, :passenger_id,
        :charges, :comments_count, :back_office_booker, :critical_flag,
        :critical_flag_enabled_by, :critical_flag_enabled_at, :labels, :status_before_cancellation
      )
    }
    its([:can]) { is_expected.to include :create_message }

    context 'when booker is not a back office user' do
      its([:back_office_booker]) { is_expected.to be false }
    end

    context 'can see_pricing' do
      context 'booking is manual' do
        let(:booking) { create(:booking, :order_received, :manual) }
        its([:can]) { is_expected.to include('see_pricing' => true) }
      end

      context 'booking is final' do
        let(:booking) { create(:booking, :rejected) }
        its([:can]) { is_expected.to include('see_pricing' => true) }
      end

      context 'booking is in customer care' do
        let(:booking) { create(:booking, :customer_care) }
        its([:can]) { is_expected.to include('see_pricing' => true) }
      end

      context 'booking is in progress' do
        let(:booking) { create(:booking, :in_progress) }
        its([:can]) { is_expected.to include('see_pricing' => false) }
      end
    end

    context 'when booker is back office user' do
      let(:company)       { create(:company) }
      let(:customer_care) { create(:user, :admin) }
      let(:booking)       { create(:booking, :reincarnated, company_info_id: company.company_info.id, booker: customer_care) }

      it 'has a :back_office_booker property set to true' do
        expect(result[:back_office_booker]).to be true
      end
    end
  end
end
