require 'rails_helper'

RSpec.describe Shared::BookingSchedules::Save, type: :service do
  let!(:preset_schedule) do
    create(:booking_schedule, :preset, scheduled_ats: [3.days.from_now, 4.days.from_now])
  end
  let!(:custom_schedule) do
    create(:booking_schedule, :custom, scheduled_ats: [1.day.from_now, 2.days.from_now])
  end

  let(:selected_dates) { [1.day.from_now, 2.days.from_now] }
  let(:preset_params) do
    {
      custom: false,
      preset_type: 'daily',
      starting_at: selected_dates.first,
      ending_at: selected_dates.last,
      workdays_only: false,
      weekdays: 0,
      recurrence_factor: '1',
      scheduled_ats: selected_dates.map(&:to_s)
    }
  end

  let(:custom_dates) { [DateTime.new(2018, 6, 12, 18, 45), DateTime.new(2018, 6, 14, 12, 15)] }
  let(:custom_params) do
    {
      custom: true,
      scheduled_ats: custom_dates.map(&:to_s),
      weekdays: 0,
      recurrence_factor: '1'
    }
  end

  before do
    allow(Bookings::ScheduleValidator).to receive(:new)
      .and_return(double(execute: double(result: {available_scheduled_ats: params[:scheduled_ats]})))
  end

  describe '#execute' do
    context 'schedule is present' do
      subject(:service) { described_class.new(schedule: schedule, params: params, booking_params: {}) }

      let(:schedule) { preset_schedule }
      let(:params)   { preset_params }

      it { expect{ service.execute }.not_to change(BookingSchedule, :count) }

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }

        its(:schedule) do
          is_expected.to have_attributes(
            custom:            false,
            preset_type:       'daily',
            starting_at:       selected_dates.first,
            ending_at:         selected_dates.last,
            workdays_only:     false,
            recurrence_factor: 1,
            weekdays:          [],
            scheduled_ats:     Sequel.pg_array(params[:scheduled_ats])
          )
        end

        context 'custom_schedule' do
          let(:schedule) { custom_schedule }
          let(:params)   { custom_params }

          it { is_expected.to be_success }
          its(:schedule) do
            is_expected.to have_attributes(
              custom: true,
              scheduled_ats: Sequel.pg_array([
                DateTime.new(2018, 6, 12, 18, 45),
                DateTime.new(2018, 6, 14, 12, 15)
              ])
            )
          end
        end
      end
    end

    context 'schedule is absent' do
      subject(:service) { described_class.new(params: params, booking_params: {}) }

      let(:params) { preset_params }

      it { expect{ service.execute }.to change(BookingSchedule, :count).by(1) }

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }

        its(:schedule) do
          is_expected.to have_attributes(
            custom:            false,
            preset_type:       'daily',
            workdays_only:     false,
            recurrence_factor: 1,
            weekdays:          [],
            scheduled_ats:     Sequel.pg_array(params[:scheduled_ats])
          )
        end

        its('schedule.starting_at') { is_expected.to be_within(1.second).of(selected_dates.first.to_datetime) }
        its('schedule.ending_at')   { is_expected.to be_within(1.second).of(selected_dates.last.to_datetime) }

        context 'custom_schedule' do
          let(:params) { custom_params }

          it { is_expected.to be_success }
          its(:schedule) do
            is_expected.to have_attributes(
              custom: true,
              scheduled_ats: Sequel.pg_array([
                DateTime.new(2018, 6, 12, 18, 45),
                DateTime.new(2018, 6, 14, 12, 15)
              ])
            )
          end
        end
      end
    end

    context 'some scheduled_ats not validated' do
      let(:avaliable_scheduled_ats) { [selected_dates.first] }
      let(:validation_service) { double(result: {available_scheduled_ats: avaliable_scheduled_ats}) }

      before do
        allow(Bookings::ScheduleValidator).to receive(:new).and_return(validation_service)
        allow(validation_service).to receive(:execute).and_return(validation_service)
      end

      subject(:service) { described_class.new(params: params, booking_params: {}) }

      let(:params) { preset_params }

      specify { expect{ service.execute }.to change(BookingSchedule, :count) }

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }

        it { expect(subject.schedule.scheduled_ats.count).to eq 1 }
      end
    end
  end
end
