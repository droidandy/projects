require 'rails_helper'

RSpec.describe TravelRules::VehicleAvailability::RuleChecker, type: :service do
  subject(:service) { TravelRules::VehicleAvailability::RuleChecker.new(rule: rule, params: params) }

  describe '#execute!' do
    let(:rule)   { nil }
    let(:params) { nil }

    subject { service.execute }

    context 'when all criteria passed' do
      before do
        expect(service).to receive(:time_fits?).and_return(true)
        expect(service).to receive(:day_fits?).and_return(true)
        expect(service).to receive(:distance_fits?).and_return(true)
        expect(service).to receive(:location_fits?).and_return(true)
      end

      it { is_expected.to be_success }
    end

    context 'when any of criteria failed' do
      before do
        expect(service).to receive(:time_fits?).and_return(true)
        expect(service).to receive(:day_fits?).and_return(true)
        expect(service).to receive(:distance_fits?).and_return(true)
        expect(service).to receive(:location_fits?).and_return(false)
      end

      it { is_expected.not_to be_success }
    end
  end

  describe 'criteria' do
    describe '#time_fits?' do
      let(:rule) { create(:travel_rule, min_time: '10:30', max_time: '20:00') }

      subject { service.send(:time_fits?) }

      context 'when fits' do
        let(:params) { {scheduled_at: '2017-06-21 11:15'} }

        it { is_expected.to be true }
      end

      context 'when does not fit' do
        let(:params) { {scheduled_at: '2017-06-21 20:01'} }

        it { is_expected.to be false }
      end
    end

    describe '#day_fits?' do
      let(:rule) { create(:travel_rule, weekdays: ['3']) }

      subject { service.send(:day_fits?) }

      context 'when fits' do
        let(:params) { {scheduled_at: '2017-06-21 11:15'} } # Wednesday - '3'

        it { is_expected.to be true }
      end

      context 'when does not fit' do
        let(:params) { {scheduled_at: '2017-06-22 20:01'} }

        it { is_expected.to be false }
      end
    end

    describe '#distance_fits?' do
      subject { service.send(:distance_fits?) }

      context 'when distance bounds are not specified' do
        let(:params) { nil }
        let(:rule) { create :travel_rule }

        it { is_expected.to be true }
      end

      context 'when distance bounds are specified' do
        let(:params) { {pickup_address: {lat: 1, lng: 2}, destination_address: {lat: 3, lng: 4}} }
        let(:location_service) { double(success?: true, result: location_result) }

        before do
          expect(GoogleApi::FindDistance).to receive(:new)
            .with(origin: [1, 2], destination: [3, 4]).and_return(location_service)
          allow(location_service).to receive(:execute).and_return(location_service)
          allow(location_service).to receive(:distance_in_miles).and_return(distance_in_miles)
        end

        context 'distance in miles' do
          let(:rule) { create(:travel_rule, min_distance: 4, max_distance: 7) }

          context 'when fits' do
            let(:location_result) { {distance: 6} }
            let(:distance_in_miles) { 6.0 }

            it { is_expected.to be true }
          end

          context 'when does not fit' do
            let(:location_result) { {distance: 8} }
            let(:distance_in_miles) { 8.0 }

            it { is_expected.to be false }
          end
        end

        context 'distance in feet' do
          let(:rule) { create(:travel_rule, min_distance: 1, max_distance: 3) }

          context 'when fits' do
            let(:location_result) { {distance: 6000, distance_measure: 'feet' } }
            let(:distance_in_miles) { 1.14 }

            it { is_expected.to be true }
          end

          context 'when does not fit' do
            let(:location_result) { {distance: 2, distance_measure: 'feet'} }
            let(:distance_in_miles) { 0.0 }

            it { is_expected.to be false }
          end
        end
      end
    end

    describe '#location_fits?' do
      subject { service.send(:location_fits?) }

      context 'when location is not specified' do
        let(:params) { nil }
        let(:rule)   { create :travel_rule }

        it { is_expected.to be true }
      end

      context 'when location is specified' do
        let(:params) { {pickup_address: {lat: 1, lng: 2}} }
        let(:rule)   { create(:travel_rule, location: 'GreaterLondon') }

        before do
          expect(TravelRules::Locations).to receive(:includes?)
            .with('GreaterLondon', lat: 1, lng: 2).and_return(fits)
        end

        context 'when fits' do
          let(:fits) { true }

          it { is_expected.to be true }
        end

        context 'when does not fit' do
          let(:fits) { false }

          it { is_expected.to be false }
        end
      end
    end
  end
end
