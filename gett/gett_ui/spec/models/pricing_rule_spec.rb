require 'rails_helper'

RSpec.describe PricingRule do
  let(:polygon) do
    [
      {lat: 0, lng: 0},
      {lat: 1, lng: 0},
      {lat: 0, lng: 1}
    ]
  end

  let(:point) { {lat: 1.1, lng: 2.2} }

  describe 'pickup/destination points' do
    let(:rule) do
      PricingRule.new(pickup_point: point, destination_point: point)
    end

    it 'converts lat/lng to sql format' do
      expect(rule.pickup_point).to eq('SRID=4326;POINT(2.2 1.1)')
      expect(rule.destination_point).to eq('SRID=4326;POINT(2.2 1.1)')
    end
  end

  describe 'pickup/destination polygon' do
    let(:rule) { build(:pricing_rule) }

    it 'converts polygon to sql format' do
      rule.pickup_polygon = rule.destination_polygon = polygon
      expect(rule.pickup_polygon).to eq('SRID=4326;POLYGON((0 0, 0 1, 1 0, 0 0))')
      expect(rule.destination_polygon).to eq('SRID=4326;POLYGON((0 0, 0 1, 1 0, 0 0))')
    end
  end

  describe 'before save' do
    it 'clears non-area attributes if rule type is area' do
      rule = create(
        :pricing_rule, :area,
        pickup_address: create(:address),
        destination_address: create(:address),
        pickup_point: point,
        destination_point: point,
        destination_polygon: polygon
      )

      expect(
        [
          rule.pickup_address,
          rule.destination_address,
          rule.pickup_point,
          rule.destination_point,
          rule.destination_polygon
        ].all?(&:nil?)
      ).to eq(true)
    end
  end
end
