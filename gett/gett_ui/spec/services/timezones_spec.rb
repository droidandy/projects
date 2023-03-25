require 'rails_helper'

RSpec.describe Timezones do
  describe '.timezone_at' do
    subject(:timezone) { Timezones.timezone_at(obj) }

    let(:finder)    { Timezones.finder }
    let(:finder_tz) { 'Timezone' }

    context 'when obj is valid' do
      before { expect(finder).to receive(:timezone_at).with(lat: 1, lng: 2).and_return(finder_tz) }

      context 'when obj is Address' do
        let(:obj) { create(:address, lat: 1, lng: 2, timezone: 'foo') }

        it { is_expected.to eq 'Timezone' }
      end

      context 'when obj is PredefinedAddress' do
        let(:obj) { create(:predefined_address, lat: 1, lng: 2, timezone: 'foo') }

        it { is_expected.to eq 'Timezone' }
      end

      context 'when obj is Hash' do
        let(:obj) { {lat: 1, lng: 2} }

        it { is_expected.to eq 'Timezone' }
      end

      context 'when obj is Aray' do
        let(:obj) { [1, 2] }

        it { is_expected.to eq 'Timezone' }
      end

      context 'when finder fails to find timezone' do
        let(:finder_tz) { nil }
        let(:obj)       { [1, 2] }

        it 'returns default timezone' do
          expect(timezone).to eq 'Europe/London'
        end
      end

      context 'when finder finds "uninhabited" timezone' do
        let(:finder_tz) { "uninhabited" }
        let(:obj)       { [1, 2] }

        it 'returns default timezone' do
          expect(timezone).to eq 'Europe/London'
        end
      end
    end

    context 'when obj is invalid' do
      it 'throws an error' do
        expect{ Timezones.timezone_at('foo').to raise_error(ArgumentError) }
      end
    end
  end
end
