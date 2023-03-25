require 'rails_helper'

RSpec.describe DriversChannel, type: :model do
  context 'class methods' do
    let!(:dcs) { create_list(:drivers_channel, 3) }

    describe 'with_location' do
      subject { described_class.with_location(location) }

      context 'existed location' do
        let(:location) { dcs.first.location }

        it { is_expected.to eq(dcs.first) }
      end

      context 'non existed location' do
        let(:location) do
          dcs.first.location.tap { |loc| loc[0] += 0.001 }
        end

        it { is_expected.to eq(nil) }
      end
    end

    describe 'in_close_vicinity_to' do
      subject { described_class.in_close_vicinity_to(lat: location[0], lng: location[1]) }

      context 'with similar location' do
        let(:location) do
          dcs.first.location.tap { |cord| cord[0] += 0.0001 }
        end

        it { is_expected.to eq(dcs.first) }
      end

      context 'with far location' do
        let(:location) do
          dcs.first.location.tap { |loc| loc[0] += 1 }
        end

        it { is_expected.to eq(nil) }
      end
    end

    describe 'expired' do
      subject { described_class.expired }

      let!(:expired_dcs) { create_list(:drivers_channel, 2, :expired) }

      its(:count) { is_expected.to eq(2) }
    end
  end
end
