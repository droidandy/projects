require 'rails_helper'
require 'spec_helper'

RSpec.describe OneTransport::ChargesLoader, type: :service do
  subject(:service) { described_class.new }

  describe '#execute' do
    let(:completed_booking_records) do
      [
        {
          ext_conf_no: "#{booking2.service_id}  ",
          waiting_time: 10,
          mileage_driven: 4.22,
          bill_misc_cost_vatable: 1.0,
          bill_journey_cost_vatable: 10.0
        },
        {
          ext_conf_no: "#{booking7.service_id}  ",
          waiting_time: 10,
          mileage_driven: 4.22,
          bill_misc_cost_vatable: 1.0,
          bill_journey_cost_vatable: 10.0
        }
      ]
    end

    let(:company) { create(:company) }
    let!(:booking1) { create(:booking, :ot, :in_progress, service_id: '100', company: company) }
    let!(:booking2) { create(:booking, :ot, :completed, scheduled_at: 1.week.ago, service_id: '200', company: company) }
    let!(:booking3) { create(:booking, :ot, :completed, scheduled_at: 2.weeks.ago, service_id: '300', company: company) }
    let!(:booking4) { create(:booking, :gett, :in_progress, service_id: '400', company: company) }
    let!(:booking5) { create(:booking, :gett, :completed, scheduled_at: 1.week.ago, service_id: '500', company: company) }
    let!(:booking6) { create(:booking, :ot, :completed, scheduled_at: 1.week.ago, service_id: '600', company: company) }
    let!(:booking7) do
      create(
        :booking,
        :ot,
        :cancelled,
        cancelled_at: 1.week.ago,
        scheduled_at: 1.week.from_now,
        service_id: '700',
        company: company
      )
    end
    let!(:manual_charges) { create(:booking_charges, manual: true, booking: booking8) }
    let!(:booking8) { create(:booking, :ot, :completed, scheduled_at: 1.week.ago, service_id: '800', company: company) }

    before do
      allow(Sequel).to receive(:connect).with(Settings.ot_charges_db.to_h)
        .and_yield(Sequel.mock(fetch: completed_booking_records))
      allow(BookingsChargesUpdater).to receive(:perform_async)
    end

    it 'updates booking ot_waiting_time for corresponding records' do
      service.execute

      booking2.reload
      expect(booking2.ot_waiting_time).to eq(10.minutes)
      expect(booking2.travel_distance).to eq(4.22)
      expect(booking2.fare_quote).to eq(1000)
      expect(booking2.ot_extra_cost).to eq(100)

      booking7.reload
      expect(booking7.ot_waiting_time).to eq(10.minutes)
      expect(booking7.travel_distance).to eq(4.22)
      expect(booking7.fare_quote).to eq(1000)
      expect(booking7.ot_extra_cost).to eq(100)

      expect(booking1.reload.ot_waiting_time).to be nil
      expect(booking3.reload.ot_waiting_time).to be nil
      expect(booking4.reload.ot_waiting_time).to be nil
      expect(booking5.reload.ot_waiting_time).to be nil
      expect(booking6.reload.ot_waiting_time).to be nil
      expect(booking8.reload.ot_waiting_time).to be nil
    end

    it 'recalculates charges corresponding records' do
      expect(BookingsChargesUpdater).to receive(:perform_async).with(booking2.id)
      expect(BookingsChargesUpdater).to receive(:perform_async).with(booking7.id)

      expect(BookingsChargesUpdater).not_to receive(:perform_async).with(booking1.id)
      expect(BookingsChargesUpdater).not_to receive(:perform_async).with(booking3.id)
      expect(BookingsChargesUpdater).not_to receive(:perform_async).with(booking4.id)
      expect(BookingsChargesUpdater).not_to receive(:perform_async).with(booking5.id)
      expect(BookingsChargesUpdater).not_to receive(:perform_async).with(booking6.id)

      service.execute
    end

    it 'logs error for records without waiting_time' do
      message = "Waiting time wasn't calculated for completed OT bookings with next service IDs: #{booking6.service_id}"

      expect(Rails.logger).to receive(:error).with(message)
      expect(Airbrake).to receive(:notify).with(message)

      service.execute
    end

    context 'with fx rate increase' do
      let(:company) { create(:company, system_fx_rate_increase_percentage: 50) }

      before do
        allow_any_instance_of(::Booking).to receive(:international?).and_return(international)
        service.execute
      end

      context 'when it applicable for international booking' do
        let(:international) { true }

        it 'change fare_quote for booking according to fx rate increase' do
          expect(booking2.reload.fare_quote).to eq(1500)
          expect(booking7.reload.fare_quote).to eq(1500)
        end
      end

      context 'when it not applicable for local booking' do
        let(:international) { false }

        it 'leave fare_quote without changes' do
          expect(booking2.reload.fare_quote).to eq(1000)
          expect(booking7.reload.fare_quote).to eq(1000)
        end
      end
    end

    context 'zero vatable costs' do
      let(:completed_booking_records) do
        [ {
          ext_conf_no: "#{booking2.service_id}  ",
          waiting_time: 10,
          mileage_driven: 4.22,
          bill_misc_cost_vatable: 0.0,
          bill_journey_cost_vatable: 0.0,
          bill_misc_cost: 2.0,
          bill_journey_cost: 5.0
        } ]
      end

      it 'uses non vatable results' do
        service.execute

        booking2.reload
        expect(booking2.ot_waiting_time).to eq(10.minutes)
        expect(booking2.travel_distance).to eq(4.22)
        expect(booking2.fare_quote).to eq(500)
        expect(booking2.ot_extra_cost).to eq(200)
      end
    end
  end
end
