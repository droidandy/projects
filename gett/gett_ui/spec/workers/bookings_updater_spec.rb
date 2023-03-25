require 'rails_helper'

RSpec.describe BookingsUpdater, type: :worker do
  let(:worker)        { BookingsUpdater.new }
  let(:ot_queue)      { double('Sidekiq::Queue') }
  let(:gett_queue)    { double('Sidekiq::Queue') }
  let(:splyt_queue)   { double('Sidekiq::Queue') }
  let(:scheduled_set) { double('Sidekiq::ScheduledSet') }

  describe '#perform' do
    before do
      create(:booking, :ot, :order_received, id: 1, booked_at: Time.current)
      create(:booking, :gett, :order_received, id: 3)
      create(:booking, :splyt, :order_received, id: 5)

      allow(Sidekiq::Queue).to receive(:new).with('ot').and_return(ot_queue)
      allow(Sidekiq::Queue).to receive(:new).with('gett').and_return(gett_queue)
      allow(Sidekiq::Queue).to receive(:new).with('splyt').and_return(splyt_queue)
      allow(Sidekiq::ScheduledSet).to receive(:new).and_return(scheduled_set)
    end

    context 'when booking updaters are not scheduled' do
      before do
        [ot_queue, gett_queue, splyt_queue, scheduled_set].each do |queue|
          allow(queue).to receive(:each)
        end
      end

      # time travel to overcome `Bookings::Updaters::OT#can_execute?` threshold
      before { Timecop.travel 1.minute.from_now }
      after  { Timecop.return }

      it 'queues updaters' do
        expect(BookingUpdaters::OT).to receive(:perform_async).with(1)
        expect(BookingUpdaters::Gett).to receive(:perform_async).with(3)
        expect(BookingUpdaters::Splyt).to receive(:perform_async).with(5)

        worker.perform
      end
    end

    context 'when booking updaters are scheduled' do
      before do
        allow(ot_queue).to      receive(:each).and_yield(OpenStruct.new(args: [1], klass: 'BookingUpdaters::OT'))
        allow(gett_queue).to    receive(:each).and_yield(OpenStruct.new(args: [3], klass: 'BookingUpdaters::Gett'))
        allow(splyt_queue).to   receive(:each).and_yield(OpenStruct.new(args: [5], klass: 'BookingUpdaters::Splyt'))
        allow(scheduled_set).to receive(:each).and_yield(OpenStruct.new(args: [7], klass: nil))
      end

      it "doesn't queue updaters" do
        expect(BookingUpdaters::OT).not_to receive(:perform_async)
        expect(BookingUpdaters::Gett).not_to receive(:perform_async)
        expect(BookingUpdaters::Splyt).not_to receive(:perform_async)

        worker.perform
      end
    end
  end
end
