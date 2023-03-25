require 'rails_helper'

RSpec.describe Admin::PricingRules::Create, type: :service do
  it { is_expected.to be_authorized_by(Admin::Policy) }

  describe '#execute' do
    let(:company) { create(:company) }
    let(:admin) { create(:user, :superadmin) }

    service_context { { user: admin } }

    subject(:service) { described_class.new(params: params) }

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
          vehicle_types: ['Standard'],
          booking_type: 'both',
          min_time: '00:00',
          max_time: '23:59',
          time_frame: 'daily'
        }
      end

      it 'creates a new pricing rule' do
        expect{ service.execute }.to change(PricingRule, :count).by(1)

        rule = service.result
        expect(rule.name).to eq('Rule 1')
        expect(rule.company).to eq(company)
        expect(rule.pickup_address).to be_present
        expect(rule.destination_address).to be_present
      end
    end

    context 'invalid params' do
      let(:params) { {} }

      it 'returns erros' do
        expect{ service.execute }.to_not change(PricingRule, :count)
        expect(service).to_not be_success
        expect(service.errors).to be_present
      end
    end
  end
end
