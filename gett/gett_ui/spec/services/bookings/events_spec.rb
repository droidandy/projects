require 'rails_helper'

describe Bookings::Events do
  let(:bookings_events) { {} }
  let(:pickup_address) { create :address, timezone: 'Europe/Kiev' }
  let(:booking) { create(:booking, status, **booking_events, travel_distance: 15.0, pickup_address: pickup_address) }
  let!(:driver) { create(:booking_driver, booking: booking, pickup_distance: 5280) }

  subject(:events) { Bookings::Events.new(booking: booking).execute.result }

  context 'when order has just been created' do
    let(:status) { :creating }
    let(:booking_events) { { created_at: DateTime.parse('2018-02-16 14:18') } }

    let(:results) do
      [{
        status: 'creating',
        is_first: true,
        is_edge: true,
        is_active: true,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: booking_events[:created_at],
        time: '16/02/2018 16:18',
        cancelled_by: nil
      }, {
        status: 'order_received',
        is_first: false,
        is_edge: true,
        is_active: false,
        is_previous_active: true,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: nil,
        time: nil,
        cancelled_by: nil
      }]
    end

    it { is_expected.to eq(results) }
  end

  context 'when order has been received' do
    let(:status) { :order_received }
    let(:booking_events) do
      {
        created_at: DateTime.parse('2018-02-16 14:18'),
        booked_at:  DateTime.parse('2018-02-16 14:19')
      }
    end

    let(:results) do
      [{
        status: 'creating',
        is_first: true,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: booking_events[:created_at],
        time: '16/02/2018 16:18',
        cancelled_by: nil
      }, {
        status: 'order_received',
        is_first: false,
        is_edge: false,
        is_active: true,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '1 minute',
        timestamp: booking_events[:booked_at],
        time: '16/02/2018 16:19',
        cancelled_by: nil
      }, {
        status: 'locating',
        is_first: false,
        is_edge: true,
        is_active: false,
        is_previous_active: true,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: nil,
        time: nil,
        cancelled_by: nil
      }]
    end

    it { is_expected.to eq(results) }
  end

  context 'when order is completed' do
    let(:status) { :completed }
    let(:booking_events) do
      {
        created_at:          DateTime.parse('2018-02-16 14:18'),
        booked_at:           DateTime.parse('2018-02-16 14:20'),
        started_locating_at: DateTime.parse('2018-02-16 14:30'),
        allocated_at:        DateTime.parse('2018-02-16 14:31'),
        arrived_at:          DateTime.parse('2018-02-16 14:40'),
        started_at:          DateTime.parse('2018-02-16 14:43'),
        ended_at:            DateTime.parse('2018-02-16 14:44')
      }
    end

    let(:results) do
      [{
        status: 'creating',
        is_first: true,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: booking_events[:created_at],
        time: '16/02/2018 16:18',
        cancelled_by: nil
      }, {
        status: 'order_received',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '2 minutes',
        timestamp: booking_events[:booked_at],
        time: '16/02/2018 16:20',
        cancelled_by: nil
      }, {
        status: 'locating',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '10 minutes',
        timestamp: booking_events[:started_locating_at],
        time: '16/02/2018 16:30',
        cancelled_by: nil
      }, {
        status: 'on_the_way',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '1 minute',
        timestamp: booking_events[:allocated_at],
        time: '16/02/2018 16:31',
        cancelled_by: nil
      }, {
        status: 'arrived',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: true,
        is_interrupted: false,
        interval_and_distance: '9 minutes, 1.0 mi',
        timestamp: booking_events[:arrived_at],
        time: '16/02/2018 16:40',
        cancelled_by: nil
      }, {
        status: 'in_progress',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '3 minutes',
        timestamp: booking_events[:started_at],
        time: '16/02/2018 16:43',
        cancelled_by: nil
      }, {
        status: 'completed',
        is_first: false,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: true,
        is_interrupted: false,
        interval_and_distance: '1 minute, 15.0 mi',
        timestamp: booking_events[:ended_at],
        time: '16/02/2018 16:44',
        cancelled_by: nil
      }]
    end

    it { is_expected.to eq(results) }
  end

  context 'when order gets immediately rejected' do
    let(:status) { :rejected }
    let(:booking_events) do
      {
        created_at:  DateTime.parse('2018-02-16 14:18'),
        booked_at:   DateTime.parse('2018-02-16 14:20'),
        rejected_at: DateTime.parse('2018-02-16 14:25')
      }
    end

    let(:results) do
      [{
        status: 'creating',
        is_first: true,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: booking_events[:created_at],
        time: '16/02/2018 16:18',
        cancelled_by: nil
      }, {
        status: 'order_received',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '2 minutes',
        timestamp: booking_events[:booked_at],
        time: '16/02/2018 16:20',
        cancelled_by: nil
      }, {
        status: 'rejected',
        is_first: false,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: true,
        interval_and_distance: '5 minutes',
        timestamp: booking_events[:rejected_at],
        time: '16/02/2018 16:25',
        cancelled_by: nil
      }]
    end

    it { is_expected.to eq(results) }
  end

  context 'when driver is allocated but order gets cancelled' do
    let(:member) { create(:member, first_name: 'Post', last_name: 'Malone') }
    let(:status) { :cancelled }
    let(:booking_events) do
      {
        created_at:          DateTime.parse('2018-02-16 14:20'),
        booked_at:           DateTime.parse('2018-02-16 14:20:5'),
        started_locating_at: DateTime.parse('2018-02-16 14:22:35'),
        allocated_at:        DateTime.parse('2018-02-16 14:32:35'),
        cancelled_at:        DateTime.parse('2018-02-16 15:00'),
        cancelled_by:        member
      }
    end

    let(:results) do
      [{
        status: 'creating',
        is_first: true,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '',
        timestamp: booking_events[:created_at],
        time: '16/02/2018 16:20',
        cancelled_by: nil
      }, {
        status: 'order_received',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '10 seconds',
        timestamp: booking_events[:booked_at],
        time: '16/02/2018 16:20',
        cancelled_by: nil
      }, {
        status: 'locating',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '3 minutes',
        timestamp: booking_events[:started_locating_at],
        time: '16/02/2018 16:22',
        cancelled_by: nil
      }, {
        status: 'on_the_way',
        is_first: false,
        is_edge: false,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: false,
        interval_and_distance: '10 minutes',
        timestamp: booking_events[:allocated_at],
        time: '16/02/2018 16:32',
        cancelled_by: nil
      }, {
        status: 'cancelled',
        is_first: false,
        is_edge: true,
        is_active: false,
        is_previous_active: false,
        is_animated: false,
        is_interrupted: true,
        interval_and_distance: '27 minutes',
        timestamp: booking_events[:cancelled_at],
        time: '16/02/2018 17:00',
        cancelled_by: 'Post Malone'
      }]
    end

    it { is_expected.to eq(results) }
  end
end
