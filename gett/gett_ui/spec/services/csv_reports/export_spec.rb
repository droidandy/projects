require 'rails_helper'

RSpec.describe CsvReports::Export, type: :service do
  let(:company) { create(:company, name: 'new_company') }
  let(:service) { described_class.new(csv_report: csv_report) }

  before { Timecop.freeze(2018, 6, 15, 9, 0, 0, DateTime.current.zone) }
  after  { Timecop.return }

  describe '#execute' do
    subject { service.execute.result }

    let(:csv_report) { create(:csv_report, :daily, company: company, headers: headers) }

    context 'when references are enabled and 2 bookings have different references' do
      let!(:booking1)   { create(:booking, :completed, company: company, scheduled_at: 12.hours.ago) }
      let!(:booking2)   { create(:booking, :completed, company: company, scheduled_at: 12.hours.ago) }
      let!(:reference1) { create(:booker_reference, booking: booking1, booking_reference_name: 'ref1', value: 'Yes') }
      let!(:reference2) { create(:booker_reference, booking: booking2, booking_reference_name: 'ref2', value: 'no') }
      let(:headers)     { { booking_id: 'true', company_name: 'true', references: 'true' } }

      it { is_expected.to include("Order ID,Company Name,ref1,ref2") }
      it { is_expected.to include("service-id,new_company,Yes,\n") }
      it { is_expected.to include("service-id,new_company,,no\n") }
    end

    context 'when references are disabled' do
      let(:booking)     { create(:booking, :completed, company: company, scheduled_at: 12.hours.ago) }
      let!(:reference1) { create(:booker_reference, booking: booking, booking_reference_name: 'Ref1', value: 'Yes') }
      let!(:reference2) { create(:booker_reference, booking: booking, booking_reference_name: 'Ref2', value: 'no') }
      let(:headers)     { { company_name: 'true' } }

      it { is_expected.to     include('Company Name') }
      it { is_expected.to_not include('Ref1') }
      it { is_expected.to_not include('Ref2') }
      it { is_expected.to_not include('Yes') }
      it { is_expected.to_not include('no') }
    end

    context 'when home address sanitanization is enabled and booking contains home address' do
      let!(:booking)   { create(:booking, :completed, company: company, scheduled_at: 12.hours.ago, pickup_passenger_address_type: 'home') }
      let(:headers)    { { pickup_address: 'true' } }

      service_context  { {front_office: true, sanitize_home_address: true} }

      it { is_expected.to include('Home') }
    end

    describe 'report period' do
      let(:csv_report) { create(:csv_report, :daily, company: company, headers: {booking_id: true}) }
      let(:current_time) { Time.current.in_time_zone(described_class::TIMEZONE) }

      before { Timecop.freeze(current_time) }
      after { Timecop.return }

      let!(:bookings) do
        [
          (current_time - 2.days).end_of_day,
          current_time - 1.day,
          current_time.beginning_of_day
        ].map do |scheduled_at|
          create(
            :booking, :completed,
            company: company,
            service_id: SecureRandom.hex,
            scheduled_at: scheduled_at
          )
        end
      end

      it 'includes bookings for previous day only' do
        expect(subject).not_to include(bookings.first.service_id)
        expect(subject).to include(bookings.second.service_id)
        expect(subject).not_to include(bookings.third.service_id)
      end
    end
  end
end
