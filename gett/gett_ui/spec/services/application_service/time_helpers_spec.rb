require 'rails_helper'

RSpec.describe ApplicationService::TimeHelpers, type: :service do
  describe '#seconds_to_hms' do
    let(:service_klass) do
      Class.new(ApplicationService) do
        include ApplicationService::TimeHelpers
      end
    end

    describe '#seconds_to_hms' do
      subject { service_klass.new.send(:seconds_to_hms, seconds) }

      context 'zero seconds' do
        let(:seconds) { 0 }

        it { is_expected.to eq '00:00:00' }
      end

      context 'less than a minute' do
        let(:seconds) { 50 }

        it { is_expected.to eq '00:00:50' }
      end

      context 'more than a minute' do
        let(:seconds) { 260 }

        it { is_expected.to eq '00:04:20' }
      end

      context 'more than an hour' do
        let(:seconds) { 15600 }

        it { is_expected.to eq '04:20:00' }
      end
    end

    describe '#last_week_period' do
      subject { service_klass.new.send(:last_week_period).to_s }

      before { Timecop.freeze('2018-09-26 12:00') }
      after { Timecop.return }

      it { is_expected.to eq '2018-09-19 23:00:00 UTC..2018-09-26 22:59:59 UTC' }
    end
  end
end
