require 'rails_helper'

RSpec.describe Shared::Bookings::Show, type: :service do
  subject(:result) { described_class.new(booking: booking).execute.result }

  describe '#cancelled_by_name' do
    let(:superadmin)   { create(:user, :superadmin) }
    let(:companyadmin) { create(:companyadmin) }
    let(:booking) do
      create(:booking, :cancelled,
        cancelled_by: cancelled_by,
        cancelled_through_back_office: cancelled_through_back_office
      )
    end

    context 'superadmin' do
      let(:cancelled_by) { superadmin }
      let(:cancelled_through_back_office) { true }

      its([:cancelled_by_name]) { is_expected.to eq 'Customer Care' }
    end

    context 'company admin' do
      let(:cancelled_by) { companyadmin }
      let(:cancelled_through_back_office) { false }

      its([:cancelled_by_name]) { is_expected.to eq companyadmin.full_name }
    end

    context 'cancelled_by is empty' do
      let(:cancelled_by) { nil }
      let(:cancelled_through_back_office) { false }

      its([:cancelled_by_name]) { is_expected.to eq nil }
    end
  end

  describe '#booker, #booker_phone' do
    let(:booker)  { create(:booker) }
    let(:booking) { create(:booking, booker: booker, phone_booking: phone_booking) }

    context 'order booked through Manage Bookings' do
      let(:phone_booking) { true }

      its([:booker]) { is_expected.to eq 'Customer Care' }
      its([:booker_phone]) { is_expected.to be_nil }
    end

    context 'order booked regularly' do
      let(:phone_booking) { false }

      its([:booker]) { is_expected.to eq booker.full_name }
      its([:booker_phone]) { is_expected.to eq booker.phone }
    end
  end

  describe 'booking data' do
    let(:booking) { create(:booking) }

    it 'includes all necessary information' do
      expect(result.with_indifferent_access).to include(
        :id,
        :service_id,
        :booker_id,
        :passenger_id,
        :message,
        :flight,
        :room,
        :status,
        :payment_method,
        :scheduled_at,
        :asap,
        :travel_distance,
        :fare_quote,
        :recurring_next,
        :service_type,
        :message_to_driver,
        :indicated_status,
        :timezone,
        :journey_type,
        :message_from_supplier,
        :otp_code,
        :booker_avatar_url
      )
    end
  end

  describe '[:path]' do
    let(:pickup_address)      { create(:address, lat: 1, lng: 1) }
    let(:destination_address) { create(:address, lat: 2, lng: 2) }
    let(:booking) do
      create(
        :booking,
        pickup_address: pickup_address,
        destination_address: destination_address
      )
    end
    let(:path_points) { [[1, 1], [2, 2]] }

    subject(:path) { result[:path] }

    context 'when booking has driver with path points' do
      let!(:driver) { create(:booking_driver, booking: booking, path_points: path_points) }

      it { is_expected.to eq path_points }
    end

    context 'when booking has driver without path points' do
      let!(:driver) { create(:booking_driver, booking: booking) }

      it { is_expected.to eq [] }
    end

    context 'when booking has no driver' do
      it { is_expected.to eq [] }
    end

    context 'when booking is in one of final statuses' do
      let(:booking) { super().update(status: :completed) }

      it { is_expected.to eq path_points }

      context "and it doesn't have a destination address" do
        let(:destination_address) { false }

        it { is_expected.to eq [] }
      end
    end

    context 'when booking is in one of billable statuses' do
      let(:booking) { super().update(status: :cancelled) }

      it { is_expected.to eq path_points }
    end

    context 'when booking is billed' do
      let(:booking)  { super().update(status: :completed) }
      let!(:invoice) { create(:invoice, booking_pks: [booking.id]) }

      it { is_expected.to eq path_points }
    end

    context 'when booking is in active status and has no driver' do
      it 'returns []' do
        booking.status = :in_progress
        expect(path).to eq []
      end
    end
  end

  describe 'home address sanitanization' do
    service_context { {front_office: true, sanitize_home_address: true} }
    let(:pickup_address) { create(:address, line: 'Line 1', lat: 1.0, lng: 2.0) }
    let(:destination_address) { create(:address, line: 'Line 2', lat: 3.0, lng: 4.0) }
    let(:address_fields) { %i(id line lat lng city region postal_code country_code timezone) }

    let(:booking) do
      create(:booking,
        pickup_address:                     pickup_address,
        pickup_passenger_address_type:      'home',
        destination_address:                destination_address,
        destination_passenger_address_type: 'home'
      )
    end

    it 'sanitizes home addresses information - obscures line, but other information' do
      expect(result[:pickup_address]).to eq(
        pickup_address.as_json(only: address_fields).merge('line' => 'Home')
      )
      expect(result[:destination_address]).to eq(
        destination_address.as_json(only: address_fields).merge('line' => 'Home')
      )
    end
  end

  describe '[:alerts]' do
    subject(:alerts) { result[:alerts] }

    let(:booking) { create(:booking) }

    context 'when no driver is assigned' do
      let!(:alert) { create(:alert, :has_no_driver, booking: booking) }

      it { is_expected.to eq [{ id: alert.id, level: 'medium', text: 'No Driver Assigned', type: 'has_no_driver' }] }

      context 'when booking is being handled by customer care' do
        let(:booking) { create(:booking, :customer_care) }

        it { is_expected.to eq [] }
      end

      context 'when alert is resolved' do
        before { alert.update(resolved: true) }

        it { is_expected.to eq [] }
      end
    end

    context 'when no alerts are present' do
      it { is_expected.to eq [] }
    end
  end

  describe '[:vendor_name]' do
    subject(:vendor) { result[:vendor_name] }

    context 'OT booking' do
      let(:booking) { create(:booking, :ot, :arrived) }

      before { create(:booking_driver, vendor_name: 'Some Vendor', booking: booking) }

      it 'takes vendor from driver information' do
        expect(vendor).to eq('Some Vendor')
      end
    end

    context 'Gett booking' do
      let(:booking)        { create(:booking, :gett, :arrived, pickup_address: pickup_address) }

      context 'with UK-based pickup_address' do
        let(:pickup_address) { create(:address, country_code: 'GB') }

        it { is_expected.to eq('Gett UK') }
      end

      context 'with RU pickup_address' do
        let(:pickup_address) { create(:address, country_code: 'RU') }

        it { is_expected.to eq('Gett RU') }
      end

      context 'with IL pickup_address' do
        let(:pickup_address) { create(:address, country_code: 'IL') }

        it { is_expected.to eq('Gett IL') }
      end
    end

    context 'GetE booking' do
      let(:booking) { create(:booking, :get_e, :arrived) }

      it { is_expected.to eq('GetE') }
    end
  end

  describe '[:vendor_phone]' do
    subject(:vendor_phone) { result[:vendor_phone] }

    context 'OT booking' do
      let(:booking) { create(:booking, :ot, :arrived) }

      before do
        create(:booking_driver, vendor_name: 'Some Vendor', booking: booking)
        create(:vehicle_vendor, name: 'Some Vendor', phone: 'phone number', key: 'key')
      end

      it 'takes phone from VehicleVendor record with the same name as specified in driver details' do
        expect(vendor_phone).to eq('phone number')
      end
    end

    context 'Gett booking' do
      let(:company)  { create(:company) }
      let(:booking)  { create(:booking, :gett, :arrived, company: company, pickup_address: pickup_address) }

      before { create(:ddi, :mega, phone: 'mega phone') }

      context 'with UK-based pickup_address' do
        let(:ddi)            { create(:ddi, phone: 'ddi phone') }
        let(:company)        { create(:company, ddi: ddi) }
        let(:pickup_address) { create(:address, country_code: 'GB') }

        it 'takes phone from company ddi' do
          expect(vendor_phone).to eq('ddi phone')
        end
      end

      context 'with RU pickup_address' do
        let(:pickup_address) { create(:address, country_code: 'RU') }

        it { is_expected.to eq('+74951377115') }
      end

      context 'with IL pickup_address' do
        let(:pickup_address) { create(:address, country_code: 'IL') }

        it { is_expected.to eq('+443451550804') }
      end
    end

    context 'GetE booking' do
      let(:booking) { create(:booking, :get_e, :arrived) }

      it { is_expected.to eq('+442038568655') }
    end
  end
end
