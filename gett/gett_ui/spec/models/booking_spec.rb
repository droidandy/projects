require 'rails_helper'

RSpec.describe Booking, type: :model do
  describe 'delegations' do
    it { is_expected.to respond_to(:total_cost) }
    it { is_expected.to respond_to(:vehicle_vendor_key) }
  end

  describe 'dataset_module' do
    describe '#critical' do
      let!(:booking) { create(:booking) }
      let!(:critical_booking) { create(:booking, :critical) }
      let!(:final_critical_booking) { create(:booking, :critical, :completed) }
      let!(:critical_company_booking) { create(:booking, company: create(:company, :critical)) }
      let!(:expired_critical_company_booking) do
        create(:passenger, company: create(:company, critical_flag_due_on: Date.current.yesterday))
      end
      let!(:vip_booking) { create(:booking, vip: true) }
      let!(:international_booking) { create(:booking, :international) }

      subject{ Booking.critical }

      specify { expect(subject.map(&:id)).to match_array([critical_booking.id, final_critical_booking.id, critical_company_booking.id, vip_booking.id, international_booking.id]) }
    end

    describe '#not_manually_charged' do
      let!(:manual_charges) { create(:booking_charges, manual: true, booking: manually_charged_booking) }
      let!(:manually_charged_booking) { create(:booking) }
      let!(:charged_booking) { create(:booking, total_cost: 1000) }
      let!(:not_charged_booking) { create(:booking) }

      subject{ Booking.not_manually_charged }

      specify { expect(subject.map(&:id)).to match_array([charged_booking.id, not_charged_booking.id]) }
    end
  end

  describe 'validations' do
    let(:cancellation_reasons) { ['mistaken_order', 'driver_asked_to', 'hailed_another_car', 'too_long_eta'] }
    let(:valid_payment_methods) { %w'account company_payment_card passenger_payment_card_periodic cash personal_payment_card business_payment_card' }

    it { is_expected.to validate_presence :company_info_id }
    it { is_expected.to validate_presence :vehicle }
    it { is_expected.to validate_presence :booker }
    it { is_expected.to validate_presence :payment_method }
    it { is_expected.to validate_presence :scheduled_at }
    it { is_expected.to validate_max_length 225, :message }
    it { is_expected.to validate_phone_number :passenger_phone }
    it { is_expected.to validate_includes cancellation_reasons, :cancellation_reason }
    it { is_expected.to validate_includes valid_payment_methods, :payment_method }

    context 'for recurring' do
      subject { create(:booking, :recurring) }

      it { is_expected.to validate_presence(:schedule_id) }
    end

    context 'without passenger' do
      subject { build(:booking, :without_passenger) }

      it { is_expected.to validate_max_length(60, :passenger_name) }
      it { is_expected.to validate_format(Sequel::Plugins::ApplicationModel::USER_NAME_FORMAT, :passenger_name) }

      context 'when booking is affiliate and room is present' do
        let(:company) { create(:company, :affiliate) }
        subject { build(:booking, :without_passenger, room: '7', company: company) }

        # max length is reduced by "Room: 7" string length
        it { is_expected.to validate_max_length(53, :passenger_name) }
      end
    end

    describe 'scheduled_at validation' do
      let(:vehicle) { create(:vehicle, :gett, earliest_available_in: 5) }

      context 'when scheduled booking' do
        subject { build(:booking, :scheduled, scheduled_at: scheduled_at, vehicle: vehicle) }

        context 'and it is less then 5 minutes in future' do
          let(:scheduled_at) { Time.current + 2.minutes }

          it { is_expected.not_to be_valid }
        end

        context 'and it is over 5 minutes in future' do
          let(:scheduled_at) { Time.current + 7.minutes }

          it { is_expected.to be_valid }
        end
      end

      context 'when update booking' do
        subject { booking.set(params) }

        let(:booking) { create(:booking, :scheduled, vehicle: vehicle) }
        let(:params) { {} }

        context 'when scheduled_at was not changed' do
          let(:params) { { scheduled_at: booking.scheduled_at } }
          it { is_expected.to be_valid }
        end

        context 'when scheduled_at is more than 5 minutes' do
          let(:params) { { scheduled_at: Time.current + 7.minutes } }
          it { is_expected.to be_valid }
        end

        context 'when scheduled_at is less than 5 minutes' do
          let(:params) { { scheduled_at: Time.current + 2.minutes } }
          it { is_expected.not_to be_valid }
        end
      end
    end

    describe 'special requirements validation' do
      let(:company) { create(:company) }
      let(:special_requirement) { create(:special_requirement, :ot) }

      before do
        company.add_special_requirement(special_requirement)
      end

      context 'when OT booking' do
        subject(:booking) do
          build(:booking, :ot, company: company, special_requirements: booking_special_requirements)
        end

        context 'when contains invalid value' do
          let(:booking_special_requirements) { ['001', 'meet_and_greet'] }

          it { is_expected.not_to be_valid }
        end

        context 'when contains valid values' do
          let(:booking_special_requirements) {}
          let(:booking_special_requirements) { [special_requirement.key] }

          it { is_expected.to be_valid }
        end
      end

      context 'when not OT booking' do
        subject(:booking) do
          build(:booking, :gett, company: company, special_requirements: booking_special_requirements)
        end

        context 'when contains invalid value' do
          let(:booking_special_requirements) { ['001', 'meet_and_greet'] }

          it { is_expected.not_to be_valid }
        end

        context 'when contains valid values' do
          let(:booking_special_requirements) { ['meet_and_greet', 'nameboard_required'] }

          it { is_expected.to be_valid }
        end
      end
    end

    describe 'bbc validation' do
      let(:company) { create(:company, :bbc) }

      context 'when journey_type is blank' do
        subject { build(:booking, company: company, journey_type: '') }

        it { is_expected.not_to be_valid }
      end

      context 'when journey_type has wrong value' do
        subject { build(:booking, company: company, journey_type: 'other') }

        it { is_expected.not_to be_valid }
      end

      context 'when journey_type has proper value' do
        subject { build(:booking, company: company, journey_type: 'home_to_work') }

        it { is_expected.to be_valid }
      end
    end
  end

  describe '#before_validation' do
    let(:company)   { create(:company) }
    let(:booker)    { create(:booker, company: company) }
    let(:passenger) { create(:passenger, company: company, phone: '+100123123123') }

    subject(:booking) { described_class.new(booker: booker, passenger: passenger) }

    it 'assigns company_info_id and passenger_phone based on member associations' do
      expect{ booking.valid? }.to change(booking, :company_info_id).from(nil).to(company.company_info.id)
        .and change(booking, :passenger_phone).from(nil).to('+100123123123')
    end
  end

  describe '#after_create' do
    let(:booking) { build(:booking) }

    it 'creates placeholder :booking_indexes record' do
      expect{ booking.save }.to change(DB[:booking_indexes], :count).by(1)
    end
  end

  describe '#after_update' do
    let(:booking) { create(:booking, :without_passenger, passenger_first_name: 'Foo', passenger_last_name: 'Bar') }

    it 'updates :booking_indexes record values' do
      expect{ booking.update(passenger_first_name: 'Bar', passenger_last_name: 'Foo') }
        .to change{ DB[:booking_indexes].where(booking_id: booking.id).get(:passenger_full_name) }
        .from('foo bar').to('bar foo')
    end
  end

  describe '#index_values' do
    let(:company)   { create(:company, name: 'Company Enterprise') }
    let(:passenger) { create(:passenger, company: company, first_name: 'John', last_name: 'Smith') }
    let(:address)   { create(:address, timezone: 'America/New_York') }
    let(:booking) do
      create(:booking, :gett,
        company:             company,
        service_id:          'service-id',
        passenger:           passenger,
        pickup_address:      address,
        scheduled_at:        '2018-10-02 02:00',
        supplier_service_id: 'supplier-id'
      )
    end

    before do
      allow(booking).to receive(:order_id).and_return('Order-Id')
      allow(booking).to receive(:vendor_name).and_return('Vendor Name')
    end

    it 'provides proper index values' do
      expect(booking.send(:index_values)).to eq(
        booking_id:          booking.id,
        service_id:          'service-id',
        order_id:            'order-id',
        supplier_service_id: 'supplier-id',
        local_scheduled_at:  '2018-10-01 22:00'.to_datetime,
        vendor_name:         'Vendor Name',
        company_id:          company.id,
        passenger_id:        passenger.id,
        passenger_full_name: 'john smith'
      )
    end
  end

  describe '#order_id' do
    subject { booking.order_id }

    let(:booking) { create(:booking, service_id: 'AA1122') }

    it { is_expected.to eq 'AA1122' }

    context 'when service provider is Splyt' do
      let(:booking) { create(:booking, :splyt, service_id: SecureRandom.uuid) }

      it { is_expected.to eq("SP#{booking.id}") }
    end
  end

  describe '#editable?' do
    before { Timecop.freeze(Time.current) }
    after { Timecop.return }

    context 'when all criteria passed' do
      subject do
        create(:booking, :order_received,
          asap: false,
          scheduled_at: (Booking::STANDARD_EDITABLE_INTERVAL + 1.minute).from_now,
          company: company
        )
      end

      context 'enterprise booking' do
        let(:company) { create(:company, :enterprise) }

        it { is_expected.to be_editable }
      end

      context 'affiliate booking' do
        let(:company) { create(:company, :affiliate) }

        it { is_expected.not_to be_editable }
      end
    end

    context 'when final' do
      subject { create(:booking, :cancelled, :scheduled) }

      it { is_expected.not_to be_editable }
    end

    context 'when asap' do
      subject { create(:booking, :order_received, :asap) }

      it { is_expected.not_to be_editable }
    end

    context "when scheduled in less than #{Booking::STANDARD_EDITABLE_INTERVAL.inspect} from now" do
      subject do
        create(:booking, :order_received,
          asap: false,
          scheduled_at: (Booking::STANDARD_EDITABLE_INTERVAL - 1.minute).from_now
        )
      end

      it { is_expected.not_to be_editable }
    end

    context 'when asap with customer_care status ' do
      subject { create(:booking, :order_received, :asap, :customer_care) }

      it { is_expected.to be_editable }
    end

    context 'when it is splyt booking' do
      subject { create(:booking, :splyt) }

      it { is_expected.not_to be_editable }
    end
  end

  describe '#editable_in_back_office?' do
    context 'when all criteria passed' do
      subject { create(:booking, :completed, payment_method: 'account', company: company) }

      context 'enterprise booking' do
        let(:company) { create(:company, :enterprise) }

        it { is_expected.to be_editable_in_back_office }
      end

      context 'affiliate booking' do
        let(:company) { create(:company, :affiliate) }

        it { is_expected.not_to be_editable_in_back_office }
      end
    end

    context 'when billed' do
      subject { create(:booking, :completed, :billed, payment_method: 'account') }

      it { is_expected.not_to be_editable_in_back_office }
    end

    context 'when payment method is cash' do
      subject { create(:booking, :completed, payment_method: 'cash') }

      it { is_expected.not_to be_editable_in_back_office }
    end

    context 'when payment method is cash with customer_care_status' do
      subject { create(:booking, :completed, :customer_care, payment_method: 'cash') }

      it { is_expected.to be_editable_in_back_office }
    end

    context 'when it is splyt booking' do
      subject { create(:booking, :splyt, status: status) }

      context 'when status is customer_care' do
        let(:status) { :customer_care }

        it { is_expected.to be_editable_in_back_office }
      end

      context 'when status is not customer_care' do
        let(:status) { :order_received }

        it { is_expected.not_to be_editable_in_back_office }
      end
    end
  end

  describe '#passenger_info' do
    subject(:passenger_info) { booking.passenger_info }

    context 'when passenger is set' do
      let(:passenger)    { create(:passenger) }
      let(:phone_number) { '+1234567890' }
      let(:booking)      { create(:booking, passenger_phone: phone_number, passenger: passenger) }

      it 'returns passengers data' do
        expect(passenger_info).to eq(
          first_name: passenger.first_name,
          last_name: passenger.last_name,
          full_name: passenger.full_name,
          phone_number: phone_number,
          email: passenger.email
        )
      end
    end

    context 'when passenger is not set' do
      let(:company) { create(:company, name: 'Hotel California') }
      let(:booking) { create(:booking, booking_params.merge(passenger: nil, company: company)) }

      context 'when passenger first and last names are set' do
        let(:booking_params) { {passenger_first_name: 'John', passenger_last_name: 'Smith', passenger_phone: '+3111222233'} }

        it 'returns correct passenger data' do
          expect(passenger_info).to eq(
            first_name: 'John',
            last_name: 'Smith',
            full_name: 'John Smith',
            phone_number: '+3111222233'
          )
        end

        context 'and when room is set' do
          let(:booking_params) { super().merge(room: 5) }

          it 'returns correct passenger data' do
            expect(passenger_info).to eq(
              first_name: 'John',
              last_name: 'Smith',
              full_name: 'John Smith, Room: 5',
              phone_number: '+3111222233'
            )
          end
        end
      end

      context 'when only room is set' do
        let(:booking_params) { {room: 5} }

        it 'returns correct passenger data' do
          expect(passenger_info).to eq(
            first_name: 'Room: 5',
            last_name: nil,
            full_name: 'Room: 5',
            phone_number: '+077077077077'
          )
        end
      end

      context 'when not name nor room is set' do
        let(:booking_params) { {} }

        it 'returns correct passenger data' do
          expect(passenger_info).to eq(
            first_name: 'Company: Hotel California',
            last_name: nil,
            full_name: 'Company: Hotel California',
            phone_number: '+077077077077'
          )
        end
      end
    end
  end

  describe '#indicated_status' do
    let(:booking) { create(:booking, :completed) }

    subject{ booking.indicated_status }

    context 'booking is not billed' do
      it { is_expected.to eq 'completed' }
    end

    context 'booking is billed' do
      let(:booking) { create(:booking, :billed) }

      it { is_expected.to eq 'billed' }
    end
  end

  describe '#destroy' do
    let(:booking) { create(:booking, :completed, :with_driver) }

    before do
      create(:booking_charges, booking: booking)
      create(:payment, booking: booking)
    end

    it 'can be destroyed with all related records' do
      expect{ booking.destroy }.to change_counts_by(
        Booking        => -1,
        BookingAddress => -2,
        BookingDriver  => -1,
        BookingCharges => -1,
        Payment        => -1
      )
    end
  end

  describe '#before_update' do
    let(:booking) { create(:booking, :recurring) }

    context 'when recurring booking status has changed' do
      it 'updates recurring_next and enqueues worker' do
        expect(booking.db).to receive(:after_commit)
        expect{ booking.update(status: :locating) }.to change(booking, :recurring_next).to(false)
      end

      context 'when recurring is suppressed' do
        before { booking.suppress_recurring! }

        it 'updates recurring_next, but does not enqueue worker' do
          expect(booking.db).to_not receive(:after_commit)
          expect{ booking.update(status: :locating) }.to change(booking, :recurring_next).to(false)
        end
      end
    end

    context 'when recurring booking status has not changed' do
      it 'does not update update recurring_next, nor it enqueues worker' do
        expect(booking.db).to_not receive(:after_commit)
        expect{ booking.update(message: 'New message') }.not_to change(booking, :recurring_next)
      end
    end
  end

  describe '#as_directed?' do
   subject { create(:booking) }

   it { is_expected.not_to be_as_directed }

   context 'when it does not have a destination address' do
     subject { create(:booking, destination_address: false) }

     it { is_expected.to be_as_directed }
   end
  end

  describe '#flags' do
    subject { create(:booking, :asap, :critical, company: company, ftr: true, vip: true) }

    let(:company) { create(:company, :critical) }

    its(:flags) { are_expected.to match_array([:vip, :ftr, :asap, :critical_flag, :critical_company]) }
  end

  describe '#passenger_name' do
    context 'when passenger is a member' do
      subject do
        passenger = create(:passenger, first_name: 'John', last_name: 'Smith')
        build(:booking, passenger: passenger)
      end

      its(:passenger_name) { is_expected.to eq('John Smith') }
    end

    context 'when passenger is not a member' do
      subject do
        build(:booking, passenger_first_name: 'John', passenger_last_name: 'Doe', passenger: nil)
      end

      its(:passenger_name) { is_expected.to eq('John Doe') }
    end
  end

  describe '#international?' do
    subject { create(:booking, pickup_address: address) }

    let(:address) { create(:address, country_code: country_code) }

    context 'when booking pickup address has domestic country code' do
      %w'GB GG JE IM'.each do |cc|
        context "when country code is #{cc}" do
          let(:country_code) { cc }

          it { is_expected.not_to be_international }
        end
      end
    end

    context 'when booking pickup address has not domestic country code' do
      let(:country_code) { 'IL' }

      it { is_expected.to be_international }
    end
  end

  describe '#domestic?' do
    subject { create(:booking, pickup_address: address) }

    let(:address) { create(:address, country_code: country_code) }

    context 'when booking pickup address has domestic country code' do
      %w'GB GG JE IM'.each do |cc|
        context "when country code is #{cc}" do
          let(:country_code) { cc }

          it { is_expected.to be_domestic }
        end
      end
    end

    context 'when booking pickup address has not domestic country code' do
      let(:country_code) { 'IL' }

      it { is_expected.not_to be_domestic }
    end
  end

  describe '#domestic?' do
    subject { create(:booking, vehicle: vehicle, pickup_address: address) }

    let(:vehicle) { create(:vehicle, :gett, name: vehicle_name) }
    let(:address) { create(:address, country_code: country_code) }
    let(:vehicle_name) { 'Standard' }
    let(:country_code) { 'GB' }

    context 'when booking is VIA: domestic, asap and vehicle is Standard from Gett' do
      it { is_expected.to be_via }
    end

    context 'when booking is international' do
      let(:country_code) { 'FR' }

      it { is_expected.not_to be_via }
    end

    context 'when booking is future' do
      subject { create(:booking, :future, scheduled_at: 2.hours.from_now, vehicle: vehicle, pickup_address: address) }

      it { is_expected.not_to be_via }
    end

    context 'when vehicle is not Standard' do
      let(:vehicle_name) { 'MPV' }

      it { is_expected.not_to be_via }
    end
  end

  describe '[:vendor_name]' do
    subject { booking.vendor_name }

    context 'OT booking' do
      let(:booking) { create(:booking, :ot, :arrived) }

      before { create(:booking_driver, vendor_name: 'Some Vendor', booking: booking) }

      it { is_expected.to eq('Some Vendor') }
    end

    context 'Gett booking' do
      let(:booking) { create(:booking, :gett, :arrived, pickup_address: pickup_address) }

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

  describe '#vatable?' do
    let(:company) { create(:company) }
    let(:booking) { create(:booking, :cash, company: company) }

    subject { booking.vatable? }

    it { is_expected.to be true }

    context 'BBC company' do
      let(:company) { create(:company, :bbc) }
      let(:booking) { create(:booking, :cash, :gett, company: company) }

      it { is_expected.to be false }
    end
  end

  describe '#message_to_driver' do
    let(:company) { create(:company) }
    let(:booking) { create(:booking, :ot, company: company) }

    subject(:message_to_driver) { booking.message_to_driver }

    it { is_expected.to eq('Some message') }

    context 'when flight present' do
      let(:booking) { create(:booking, :with_flight, company: company) }

      it { is_expected.to eq('Flight: EK 530, Some message') }
    end

    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }
      let(:special_requirements) { [] }

      it { is_expected.to eq('Some message') }

      context 'when non OT booking' do
        let(:booking) { create(:booking, :gett, company: company, special_requirements: special_requirements) }

        context 'when special requirements nil' do
          let(:special_requirements) { nil }

          it { is_expected.to eq('Some message') }
        end

        context 'when special requirements present' do
          let(:special_requirements) { ['meet_and_greet'] }

          it { is_expected.to eq('Meet and Greet, Some message') }
        end
      end
    end
  end

  describe 'scopes' do
    describe 'fully_created' do
      subject(:scope) { described_class.fully_created }

      context 'status is "creating"' do
        let!(:booking) { create(:booking, status: 'creating', service_id: 'sid') }

        it { is_expected.to_not include(booking) }
      end

      context 'service_id is null' do
        let!(:booking) { create(:booking, status: 'on_the_way', service_id: nil) }

        it { is_expected.to_not include(booking) }
      end

      context 'status is not "creating" and service_id present' do
        let!(:booking) { create(:booking, status: 'on_the_way', service_id: 'sid') }

        it { is_expected.to include(booking) }
      end
    end
  end

  describe 'stop_addresses' do
    let(:addresses) { create_list(:address, 3) }
    let(:booking) { create(:booking, stop_addresses: addresses) }

    it 'preserves order of stop addresses' do
      expect(booking.stop_addresses.map(&:id)).to eq(addresses.map(&:id))
    end
  end
end
