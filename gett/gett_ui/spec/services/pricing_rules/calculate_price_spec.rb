require 'rails_helper'

RSpec.describe PricingRules::CalculatePrice, type: :service do
  let(:has_stops) { false }
  let(:asap) { true }
  let(:scheduled_at) { Time.current }

  subject(:service) do
    described_class.new(
      company: rule.company,
      vehicle_type: rule.vehicle_types.first,
      pickup: { lat: 0, lng: 0 },
      destination: { lat: 10, lng: 10 },
      has_stops: has_stops,
      distance: 10,
      asap: asap,
      scheduled_at: scheduled_at
    )
  end

  context 'metered point-to-point' do
    let!(:rule) { create(:pricing_rule, :meter) }

    it 'returns price based on distance' do
      service.execute
      expect(service.result).to eq(1200)
    end

    context 'with stops' do
      let(:has_stops) { true }

      it 'does not apply point-to-point rule' do
        service.execute
        expect(service.result).to be_nil
      end
    end
  end

  context 'fixed point-to-point' do
    let!(:rule) { create(:pricing_rule) }

    it 'returs fixed fare' do
      service.execute
      expect(service.result).to eq(rule.base_fare * 100)
    end
  end

  context 'metered area' do
    let!(:rule) { create(:pricing_rule, :area) }

    it 'returns price based on distance' do
      service.execute
      expect(service.result).to eq(1200)
    end
  end

  context 'asap rule' do
    let!(:rule) { create(:pricing_rule, booking_type: 'asap') }

    context 'asap booking' do
      let(:asap) { true }

      it 'applies the rule' do
        expect(service.execute.result).to_not be_nil
      end
    end

    context 'future booking' do
      let(:asap) { false }

      it 'does not apply the rule' do
        expect(service.execute.result).to be_nil
      end
    end
  end

  context 'time limited rule' do
    let!(:rule) { create(:pricing_rule, min_time: '8:00', max_time: '11:00') }

    context 'booking is scheduled within the time period' do
      let(:scheduled_at) { Time.new(2018, 1, 1, 10, 59, 59) }

      it 'applies the rule' do
        expect(service.execute.result).to_not be_nil
      end
    end

    context 'booking is scheduled outside of the time period' do
      let(:scheduled_at) { Time.new(2018, 1, 1, 7, 59, 59) }

      it 'does not apply the rule' do
        expect(service.execute.result).to be_nil
      end
    end
  end

  context 'custom time frame rule' do
    let(:rule) do
      create(:pricing_rule, :custom, starting_at: 1.day.ago, ending_at: 1.day.from_now)
    end

    context 'scheduled within time frame' do
      let(:scheduled_at) { 1.hour.from_now }

      it 'applies the rule' do
        expect(service.execute.result).to_not be_nil
      end
    end

    context 'scheduled ouside of time frame' do
      let(:scheduled_at) { 2.days.from_now }

      it 'does not apply the rule' do
        expect(service.execute.result).to be_nil
      end
    end
  end
end
