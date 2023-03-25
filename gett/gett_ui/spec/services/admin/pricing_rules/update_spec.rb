require 'rails_helper'

RSpec.describe Admin::PricingRules::Update, type: :service do
  it { is_expected.to be_authorized_by(Admin::Policy) }

  describe '#execute' do
    let(:company) { create(:company) }
    let(:pricing_rule) { create(:pricing_rule, :area) }
    let(:admin) { create(:user, :superadmin) }

    service_context { { user: admin } }

    subject(:service) { described_class.new(pricing_rule: pricing_rule, params: params) }

    context 'valid params' do
      let(:address_params) do
        {
          lat: 1,
          lng: 1,
          postal_code: 'ABC 123',
          country_code: 'UK',
          line: '1 Swan Lane',
          timezone: 'UTC',
          city: 'London'
        }
      end

      let(:polygon_params) do
        [{lat: 0, lng: 0}, {lat: 1, lng: 0}, {lat: 0, lng: 1}]
      end

      let(:params) do
        {
          company_id: company.id,
          name: 'Rule 1',
          active: true,
          rule_type: 'point_to_point',
          price_type: 'meter',
          initial_cost: 10,
          after_distance: 5,
          after_cost: 1,
          pickup_address: address_params,
          destination_address: address_params,
          pickup_polygon: polygon_params,
          destination_polygon: polygon_params,
          vehicle_types: ['Standard']
        }
      end

      it 'creates a new pricing rule' do
        service.execute
        expect(service).to be_success

        rule = service.result
        expect(rule.name).to eq('Rule 1')
        expect(rule.company).to eq(company)
        expect(rule.pickup_address).to be_present
        expect(rule.destination_address).to be_present
      end
    end

    context 'invalid params' do
      let(:params) { {rule_type: 'area', price_type: 'fixed'} }

      it 'returns erros' do
        service.execute
        expect(service).to_not be_success
        expect(service.errors).to be_present
      end
    end
  end
end
