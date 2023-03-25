require 'rails_helper'

RSpec.describe Admin::PricingRules::Copy, type: :service do
  describe '#execute' do
    let(:company) { create(:company) }
    let(:other_company) { create(:company) }
    let(:admin) { create(:user, :superadmin) }

    service_context { { user: admin } }

    subject(:service) { described_class.new(**params) }

    context 'valid params' do
      let(:params) do
        {
          source_id: other_company.id,
          target_id: company.id
        }
      end

      context 'rule has point type' do
        let!(:pricing_rule) { create(:pricing_rule, company: other_company) }

        it 'creates a new pricing rule' do
          expect{ service.execute }.to change{ company.reload.pricing_rules.count }.by(1)

          rule = company.pricing_rules.last
          expect(rule.name).to eq(pricing_rule.name)
          expect(rule.company).to eq(company)
          expect(rule.pickup_point).to eq(pricing_rule.pickup_point)
          expect(rule.destination_point).to eq(pricing_rule.destination_point)
          expect(rule.pickup_polygon).to eq(pricing_rule.pickup_polygon)
          expect(rule.destination_polygon).to eq(pricing_rule.destination_polygon)
        end
      end

      context 'rule has area type' do
        let!(:pricing_rule) { create(:pricing_rule, :area, company: other_company) }

        it 'creates a new pricing rule' do
          expect{ service.execute }.to change{ company.reload.pricing_rules.count }.by(1)

          rule = company.pricing_rules.last
          expect(rule.name).to eq(pricing_rule.name)
          expect(rule.company).to eq(company)
          expect(rule.pickup_point).to eq(pricing_rule.pickup_point)
          expect(rule.destination_point).to eq(pricing_rule.destination_point)
          expect(rule.pickup_polygon).to eq(pricing_rule.pickup_polygon)
          expect(rule.destination_polygon).to eq(pricing_rule.destination_polygon)
        end
      end
    end

    context 'invalid params' do
      let(:params) { {} }

      it 'returns erros' do
        expect{ service.execute }.to_not change(PricingRule, :count)
        expect(service).to_not be_success
      end
    end
  end
end
