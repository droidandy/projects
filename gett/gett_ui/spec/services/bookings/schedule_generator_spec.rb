require 'rails_helper'

RSpec.describe Bookings::ScheduleGenerator, type: :service do
  let(:service) { Bookings::ScheduleGenerator.new(params: params) }

  describe 'execution results' do
    before { expect(service.execute).to be_success }

    subject { service.result.map{ |date| date.strftime('%Y-%m-%d') } }

    context 'when schedule is daily' do
      let(:params) do
        {
          preset_type: 'daily',
          workdays_only: true,
          recurrence_factor: '2',
          starting_at: '2018-04-02 10:00',
          ending_at: '2018-04-09 10:00'
        }
      end

      it { is_expected.to eq(%w'2018-04-02 2018-04-04 2018-04-06') }
    end

    context 'when schedule is weekly' do
      let(:params) do
        {
          preset_type: 'weekly',
          recurrence_factor: '2',
          weekdays: ['2', '4', '6'], # Mon, Wed, Fri
          starting_at: '2018-04-02 10:00',
          ending_at: '2018-04-22 10:00'
        }
      end

      it { is_expected.to eq(%w'2018-04-02 2018-04-04 2018-04-06 2018-04-16 2018-04-18 2018-04-20') }
    end

    context 'when schedule is monthly' do
      let(:params) do
        {
          preset_type: 'monthly',
          recurrence_factor: '2',
          starting_at: '2018-04-02 10:00',
          ending_at: '2018-06-02 10:00'
        }
      end

      it { is_expected.to eq(%w'2018-04-02 2018-06-02') }
    end
  end
end
