require 'rails_helper'

RSpec.describe Bookings::Query, type: :service do
  subject(:bookings) { service.execute.result }

  let(:service) { described_class.new(query: query, dataset: Booking, common: sift_by_common, admin: sift_by_admin) }

  let(:query)          { {} }
  let(:sift_by_common) { false }
  let(:sift_by_admin)  { false }

  describe 'defaults' do
    it "doesn't paginate dataset by default, since services like CSV report generators depend on unpaginated data" do
      expect(service).not_to be_paginated
      expect(bookings).not_to respond_to(:current_page)
    end
  end

  describe '#query_by(:from, :to) for international bookings' do
    let(:address)      { create(:address, timezone: 'America/New_York') }
    let(:stop_address) { create(:address, timezone: 'America/New_York') }

    let!(:booking1) do
      create(:booking, pickup_address: address, scheduled_at: DateTime.new(2018, 4, 15, 22))
    end
    let!(:booking2) do
      create(:booking, pickup_address: address, scheduled_at: DateTime.new(2018, 4, 16, 2), stop_addresses: [stop_address])
    end
    let!(:booking3) do
      create(:booking, pickup_address: address, scheduled_at: DateTime.new(2018, 4, 16, 22))
    end

    subject { bookings.all.pluck(:scheduled_at) }

    describe '#query_by(:from)' do
      let(:query) { { from: '2018-04-16' } }

      it 'filters all bookings scheduled after given `from` date' do
        is_expected.to eq([booking3.scheduled_at])
      end
    end

    describe '#query_by(:to)' do
      let(:query) { { to: '2018-04-15' } }

      it 'filters all bookings scheduled before given `to` date' do
        is_expected.to eq([booking1.scheduled_at, booking2.scheduled_at])
      end
    end
  end

  describe '#query_by(:from, :to)' do
    let(:query_time) { 10.days.ago.strftime("%Y-%m-%d") }

    let!(:early_booking) { create(:booking, scheduled_at: 2.months.ago) }
    let!(:late_booking) { create(:booking, scheduled_at: 1.week.ago) }
    let!(:todays_booking) { create(:booking, scheduled_at: Time.current) }

    subject { bookings.all.pluck(:scheduled_at) }

    before { Timecop.freeze(Time.current) }
    after  { Timecop.return }

    describe '#query_by(:from)' do
      let(:query) { { from: query_time } }

      it 'filters all bookings scheduled after given `from` date' do
        is_expected.to include(late_booking.scheduled_at)
        is_expected.to include(todays_booking.scheduled_at)
        is_expected.to_not include(early_booking.scheduled_at)
      end
    end

    describe '#query_by(:to)' do
      let(:query) { { to: query_time } }

      it 'filters all bookings scheduled before given `to` date' do
        is_expected.to include(early_booking.scheduled_at)
        is_expected.to_not include(late_booking.scheduled_at)
      end
    end
  end

  describe '#query_by(:payment_method)' do
    let(:query) { { payment_method: ['account'] } }

    let!(:account)        { create(:booking, :account) }
    let!(:passenger_card) { create(:booking, :personal_card) }

    subject { bookings.all.pluck(:id) }

    it { is_expected.to match_array [account.id] }
  end

  describe '#query_by(:status)' do
    let(:query) { { status: ['completed', 'billed'] } }

    let!(:completed) { create(:booking, :completed) }
    let!(:billed)    { create(:booking, :completed, :billed) }

    before do
      create(:booking, :order_received)
    end

    subject { bookings.all.pluck(:id) }

    it { is_expected.to match_array [completed.id, billed.id] }

    context 'when only completed invoices are required' do
      let(:query) { { status: ['completed'] } }

      it { is_expected.to eq [completed.id] }
    end
  end

  describe '#query_by(:vehicle_types)' do
    let(:query) { { vehicle_types: ['gt_vehicle2', 'gt_vehicle3'] } }

    let(:vehicle_1) { create(:vehicle, :gett, name: 'gt_vehicle1', value: 'product1') }
    let(:vehicle_2) { create(:vehicle, :gett, name: 'gt_vehicle2', value: 'product2') }
    let(:vehicle_3) { create(:vehicle, :gett, name: 'gt_vehicle3', value: 'product3') }

    let!(:booking_1) { create(:booking, vehicle: vehicle_1) }
    let!(:booking_2) { create(:booking, vehicle: vehicle_2) }
    let!(:booking_3) { create(:booking, vehicle: vehicle_3) }

    subject { bookings.all.pluck(:id) }

    it { is_expected.to match_array [booking_2.id, booking_3.id] }
  end

  describe '#query_by(:vendor_name)' do
    let(:vehicle_1) { create(:vehicle, :get_e, name: 'get_e_vehicle1', value: 'product2') }
    let(:vehicle_2) { create(:vehicle, :get_e, name: 'get_e_vehicle2', value: 'product3') }

    let!(:booking_1) { create(:booking, :splyt) }
    let!(:booking_2) { create(:booking, vehicle: vehicle_1) }
    let!(:booking_3) { create(:booking, vehicle: vehicle_2) }

    subject { bookings.all.pluck(:id) }

    context 'when vendor name is blank' do
      let(:query) { { vendor_name: ' ' } }

      it { is_expected.to match_array [booking_1.id] }
    end

    context 'when vendor name is GetE' do
      let(:query) { { vendor_name: 'GetE' } }

      it { is_expected.to match_array [booking_2.id, booking_3.id] }
    end
  end

  describe '#query_by(:page, :per_page, :last)' do
    let!(:booking) { create(:booking) }

    subject { bookings.all.pluck(:id) }

    context 'when page number is correct' do
      let(:query) { { page: 1 } }

      it { is_expected.to eq [booking.id] }
    end

    context 'when page number is too high' do
      let(:query) { { page: 2 } }

      it { is_expected.to eq [booking.id] }
    end
  end

  describe '#sift_by(:booking_id, :per_page, page: "auto")' do
    let(:company)    { create(:company) }
    let!(:booking_1) { create(:booking, company: company, scheduled_at: 3.days.ago) }
    let!(:booking_2) { create(:booking, company: company, scheduled_at: 2.days.ago) }
    let!(:booking_3) { create(:booking, company: company, scheduled_at: 1.day.ago) }

    subject { bookings.all.pluck(:id) }

    describe '#query_by(order: "scheduledAt")' do
      let(:query) { {order: 'scheduledAt', page: 'auto', per_page: 2, booking_id: booking_3.id} }

      it { is_expected.to eq [booking_3.id] }
    end
  end

  describe "#query_by(order: 'fareQuote')" do
    let(:query) { { order: 'fareQuote' } }

    let!(:booking_1) { create(:booking, fare_quote: 2) }
    let!(:booking_2) { create(:booking, fare_quote: 1) }

    subject { bookings.all.pluck(:id) }

    it { is_expected.to eq [booking_2.id, booking_1.id] }
  end

  describe "#query_by(order: 'totalCost')" do
    let!(:booking_with_non_zero_total_cost_1)            { create(:booking, :cancelled, total_cost: 2) }
    let!(:booking_with_non_zero_total_cost_2)            { create(:booking, :completed, total_cost: 1) }
    let!(:booking_with_zero_total_cost_1)                { create(:booking, :completed, total_cost: 0) }
    let!(:booking_withot_charges_1)                      { create(:booking, :completed) }
    let!(:unbillable_booking_with_non_zero_total_cost_1) { create(:booking, :in_progress, total_cost: 2) }
    let!(:booking_with_non_zero_total_cost_3)            { create(:booking, :completed, total_cost: 5) }
    let!(:booking_with_zero_total_cost_2)                { create(:booking, :completed, total_cost: 0) }
    let!(:booking_withot_charges_2)                      { create(:booking, :cancelled) }
    let!(:unbillable_booking_with_non_zero_total_cost_2) { create(:booking, :rejected, total_cost: 6) }

    subject { bookings.all.pluck(:id) }

    let(:non_zero_ids) do
      [
        booking_with_non_zero_total_cost_2.id,
        booking_with_non_zero_total_cost_1.id,
        booking_with_non_zero_total_cost_3.id
      ]
    end
    let(:zero_ids) { [booking_with_zero_total_cost_1.id, booking_with_zero_total_cost_2.id] }
    let(:nil_ids) do
      [
        booking_withot_charges_1.id,
        booking_withot_charges_2.id,
        unbillable_booking_with_non_zero_total_cost_1.id,
        unbillable_booking_with_non_zero_total_cost_2.id
      ]
    end

    context 'direct order' do
      let(:query) { { order: 'totalCost' } }

      it 'orders asc by total caost and puts nils to the end' do
        expect(subject.slice(0, 2)).to match_array zero_ids
        expect(subject.slice(2, 3)).to eq non_zero_ids
        expect(subject.slice(5, 4)).to match_array nil_ids
      end
    end

    context 'reverse order' do
      let(:query) { { order: 'totalCost', reverse: 'true' } }

      it 'orders desc by total caost and puts nils to the end' do
        expect(subject.slice(0, 3)).to eq non_zero_ids.reverse
        expect(subject.slice(3, 2)).to match_array zero_ids
        expect(subject.slice(5, 4)).to match_array nil_ids
      end
    end
  end

  describe "query_by(order: 'passenger')" do
    subject { bookings.all.pluck(:id) }

    let(:company)   { create(:company) }
    let(:admin)     { create(:admin, company: company) }
    let(:passenger) { create(:passenger, company: company, first_name: 'John', last_name: 'Lennon') }
    let(:booking_with_passenger) { create(:booking, passenger: passenger, booker: admin) }
    let(:booking_without_passenger) do
      create(:booking, :without_passenger,
        passenger_first_name: 'Mary',
        passenger_last_name: 'Poppins',
        booker: admin
      )
    end

    let!(:booking_ids) { [booking_with_passenger, booking_without_passenger].pluck(:id) }

    context 'ordering ASC' do
      let(:query) { {order: 'passenger'} }

      it { is_expected.to eq(booking_ids) }
    end

    context 'ordering DESC' do
      let(:query) { {order: 'passenger', reverse: true} }

      it { is_expected.to eq(booking_ids.reverse) }
    end
  end

  describe "query_by(order: 'orderId')" do
    subject { bookings.all.pluck(:id) }

    let!(:booking_1) { create(:booking, service_id: '111') }
    let!(:booking_2) { create(:booking, service_id: 'ze') }
    let!(:booking_3) { create(:booking, service_id: 'ab') }
    let!(:booking_4) { create(:booking, :splyt, service_id: 'ze', id: 12345) }
    let!(:booking_5) { create(:booking, :splyt, service_id: '111', id: 34567) }

    let(:booking_ids) { [booking_1.id, booking_3.id, booking_4.id, booking_5.id, booking_2.id] }

    context 'ordering ASC' do
      let(:query) { {order: 'orderId'} }

      it { is_expected.to eq(booking_ids) }
    end

    context 'ordering DESC' do
      let(:query) { {order: 'orderId', reverse: true} }

      it { is_expected.to eq(booking_ids.reverse) }
    end
  end

  describe 'query_by(:include_passenger_ids)' do
    subject { bookings.all.pluck(:id) }

    let(:company)     { create(:company) }
    let(:passenger_1) { create(:passenger, company: company) }
    let(:passenger_2) { create(:passenger, company: company) }
    let(:passenger_3) { create(:passenger, company: company) }
    let!(:booking_1) { create(:booking, passenger: passenger_1) }
    let!(:booking_2) { create(:booking, passenger: passenger_2) }
    let!(:booking_3) { create(:booking, passenger: passenger_3) }

    let(:query) { { include_passenger_ids: passenger_1.id } }

    it { is_expected.to match_array([booking_1.id]) }
  end

  describe 'query_by(:exclude_passenger_ids)' do
    subject { bookings.all.pluck(:id) }

    let(:company)     { create(:company) }
    let(:passenger_1) { create(:passenger, company: company) }
    let(:passenger_2) { create(:passenger, company: company) }
    let(:passenger_3) { create(:passenger, company: company) }
    let!(:booking_1) { create(:booking, passenger: passenger_1) }
    let!(:booking_2) { create(:booking, passenger: passenger_2) }
    let!(:booking_3) { create(:booking, passenger: passenger_3) }
    let!(:booking_4) { create(:booking, :without_passenger, company: company) }

    let(:query) { { exclude_passenger_ids: passenger_1.id } }

    it { is_expected.to match_array([booking_2.id, booking_3.id, booking_4.id]) }
  end

  context 'sift_by :common' do
    let(:sift_by_common) { true }

    let(:company) { create(:company) }
    let(:admin)   { create(:admin, company: company) }

    describe '.query_by(:search)' do
      subject { bookings.all.pluck(:id) }

      context 'when searching for service_id' do
        before { create_booking }

        context 'when Gett booking' do
          let!(:booking) { create_booking(service_id: 'gett-id') }
          let(:query)    { {search: 'gett'} }

          it { is_expected.to eq([booking.id]) }
        end

        context 'when OT booking' do
          let!(:booking) { create_booking(:ot, service_id: 'ot-id') }
          let(:query)    { {search: 'ot'} }

          it { is_expected.to eq([booking.id]) }
        end
      end

      context 'when searching for supplier_service_id' do
        before { create_booking }

        context 'when Splyt booking' do
          let!(:booking) { create_booking(:splyt) }
          let(:query)    { {search: 'supplier'} }

          it { is_expected.to eq([booking.id]) }
        end
      end

      context 'when searching for passenger name' do
        context 'when internal passenger was specified' do
          let(:passenger) { create(:passenger, company: company, first_name: 'John', last_name: 'Smith') }
          let!(:booking)  { create(:booking, booker: admin, passenger: passenger) }
          let(:query)     { {search: 'john s'} }

          it { is_expected.to eq([booking.id]) }
        end

        context 'when anonymous passenger was specified' do
          let!(:booking) { create_booking }
          let(:query)    { {search: 'john s'} }

          it { is_expected.to eq([booking.id]) }
        end
      end

      def create_booking(*traits, **params)
        create(:booking, :without_passenger, *traits, params.reverse_merge(booker: admin, passenger_first_name: 'John', passenger_last_name: 'Smith'))
      end
    end
  end

  context 'sift_by :admin' do
    let(:sift_by_admin) { true }

    describe 'searching for orders with superseded company_info' do
      let(:query)   { {search: 'my-service-id'} }
      let(:company) { create(:company) }
      let(:old_company_info) { create(:company_info, company_id: company.id, active: false) }
      let!(:booking) { create(:booking, company: company, company_info_id: old_company_info.id, service_id: 'my-service-id') }

      subject { bookings.all.pluck(:id) }

      it { is_expected.to match_array([booking.id]) }
    end

    describe 'query_by(:company_type)' do
      let(:query) { {company_type: 'enterprise'} }

      let(:ent_company) { create(:company) }
      let(:aff_company) { create(:company, :affiliate) }
      let!(:ent_booking) { create(:booking, company: ent_company) }
      let!(:aff_booking) { create(:booking, company: aff_company) }

      subject { bookings.all.pluck(:id) }

      it { is_expected.to match_array([ent_booking.id]) }

      context 'when querying for affiliates' do
        let(:query) { {company_type: 'affiliate'} }

        it { is_expected.to match_array([aff_booking.id]) }
      end
    end

    describe "query_by(critical: 'true')" do
      let(:query) { { critical: 'true' } }

      let!(:future_booking)        { create(:booking, :scheduled) }
      let!(:asap_booking)          { create(:booking) }
      let!(:ftr_booking)           { create(:booking, :scheduled, ftr: true) }
      let!(:vip_booking)           { create(:booking, :scheduled, vip: true) }
      let!(:critical_ride_booking) { create(:booking, :scheduled, critical_flag: true) }
      let!(:international_booking) { create(:booking, :international) }

      subject { bookings.all.pluck(:id) }

      it do
        is_expected.to match_array([
          vip_booking.id,
          critical_ride_booking.id,
          international_booking.id
        ])
      end
    end

    describe '#query_by(:labels)' do
      let(:query) { {labels: ['asap', 'ftr']} }

      let!(:future_booking)        { create(:booking, :scheduled) }
      let!(:asap_booking)          { create(:booking) }
      let!(:ftr_booking)           { create(:booking, :scheduled, ftr: true) }
      let!(:vip_booking)           { create(:booking, :scheduled, vip: true) }
      let!(:critical_ride_booking) { create(:booking, :scheduled, critical_flag: true) }

      subject { bookings.all.pluck(:id) }

      it { is_expected.to match_array([asap_booking.id, ftr_booking.id]) }

      context 'when querying for critical options' do
        let(:query) { {labels: ['critical_flag', 'critical_company']} }

        let!(:critical_company_booking) { create(:booking, :scheduled, company: company) }
        let(:company)                   { create(:company, critical_flag_due_on: Date.current + 2.days) }

        it { is_expected.to match_array([critical_ride_booking.id, critical_company_booking.id]) }
      end

      context 'when querying for international orders' do
        let(:query) { {labels: ['international_flag']} }

        let!(:international_booking_1) { create(:booking, :international) }
        let!(:international_booking_2) { create(:booking, :international) }

        it { is_expected.to match_array([international_booking_1.id, international_booking_2.id]) }
      end
    end

    describe '#query_by(:company_id)' do
      let!(:company_1) { create(:company) }
      let!(:company_2) { create(:company) }
      let!(:company_3) { create(:company) }
      let!(:booking_1) { create(:booking, company: company_1) }
      let!(:booking_2) { create(:booking, company: company_2) }
      let!(:booking_3) { create(:booking, company: company_3) }

      let(:query) { {company_id: company_1.id} }

      subject { bookings.all.pluck(:id) }

      it { is_expected.to eq([booking_1.id]) }
    end
  end
end
