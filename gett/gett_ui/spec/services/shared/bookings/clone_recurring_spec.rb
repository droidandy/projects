require 'rails_helper'

RSpec.describe Shared::Bookings::CloneRecurring, type: :service do
  describe '#execute' do
    describe 'artificial flow' do
      context 'with scheduled_at not from schedule list' do
        let(:company)  { create(:company) }
        let(:schedule) { create(:booking_schedule, :custom) }
        let!(:booking) do
          create(:booking, :recurring,
            company: company,
            schedule: schedule,
            scheduled_at: schedule.scheduled_ats.first - 1.minute)
        end
        let(:new_date) { booking.schedule.scheduled_ats.last }

        subject(:service) { described_class.new(booking: booking) }

        describe 'execution results' do
          before { service.execute }

          its('next_booking.scheduled_at') { is_expected.to eq new_date }
        end
      end
    end

    describe 'common flow' do
      let(:company)  { create(:company) }
      let!(:booking) { create(:booking, :recurring, company: company) }
      let(:new_date) { booking.schedule.scheduled_ats.last }

      subject(:service) { described_class.new(booking: booking) }

      before do
        allow(CreateBookingRequestWorker).to receive(:perform_async).and_return(true)
        allow(Faye.bookings).to receive(:notify_create).and_return(true)
      end

      it { expect{ service.execute }.to change(Booking, :count).by(1) }

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
        its(:next_booking) do
          is_expected.to have_attributes(
            booker_id: booking.booker_id,
            message: booking.message,
            passenger_phone: booking.passenger_phone,
            passenger_id: booking.passenger_id,
            asap: booking.asap
          )
        end
        its('next_booking.booker_id') { is_expected.to eq booking.booker_id }
        its('next_booking.message') { is_expected.to eq booking.message }
        its('next_booking.flight') { is_expected.to eq booking.flight }
        its('next_booking.vehicle') { is_expected.to eq booking.vehicle }
        its('next_booking.travel_distance') { is_expected.to eq booking.travel_distance }
        its('next_booking.travel_reason') { is_expected.to eq booking.travel_reason }
        its('next_booking.international_flag') { is_expected.to eq booking.international_flag }
        its('next_booking.quote_id') { is_expected.to eq booking.quote_id }
        its('next_booking.passenger_id') { is_expected.to eq booking.passenger_id }
        its('next_booking.passenger_first_name') { is_expected.to eq booking.passenger_first_name }
        its('next_booking.passenger_last_name') { is_expected.to eq booking.passenger_last_name }
        its('next_booking.passenger_phone') { is_expected.to eq booking.passenger_phone }
        its('next_booking.phone_booking') { is_expected.to eq booking.phone_booking }
        its('next_booking.payment_method') { is_expected.to eq booking.payment_method }
        its('next_booking.payment_card') { is_expected.to eq booking.payment_card }
        its('next_booking.fare_quote') { is_expected.to eq booking.fare_quote }
        its('next_booking.company_info_id') { is_expected.to eq booking.company_info_id }
        its('next_booking.source_type') { is_expected.to eq booking.source_type }
        its('next_booking.asap') { is_expected.to eq booking.asap }
        its('next_booking.vip') { is_expected.to eq booking.vip }
        its('next_booking.ftr') { is_expected.to eq booking.ftr }
        its('next_booking.pickup_address') { is_expected.to eq booking.pickup_address }
        its('next_booking.destination_address') { is_expected.to eq booking.destination_address }
        its('next_booking.stop_addresses') { is_expected.to eq booking.stop_addresses }
        its('next_booking.schedule') { is_expected.to eq booking.schedule }

        its('next_booking.scheduled_at') { is_expected.to eq new_date }
        its('next_booking.status') { is_expected.to eq 'creating' }

        its('next_booking.created_at') { is_expected.not_to eq booking.created_at }
        its('next_booking.updated_at') { is_expected.not_to eq booking.updated_at }
      end
    end
  end
end
