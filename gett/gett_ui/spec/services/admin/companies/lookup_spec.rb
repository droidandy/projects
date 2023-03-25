require 'rails_helper'

RSpec.describe Admin::Companies::Lookup, type: :service do
  let!(:company) { create(:company) }

  subject(:service) { described_class.new }

  describe '#execute' do
    let(:result) do
      [
        id: company.id,
        name: company.name,
        company_type: company.company_type,
        customer_care_password_required: false,
        bookings_validation_enabled: false,
        active: true,
        has_pricing_rules_configured: false
      ]
    end

    it 'returns a list of all companies' do
      expect(service.execute.result).to eq result
    end

    context 'company has pricing rules configured' do
      before do
        create(:pricing_rule, company: company)
        service.execute
      end

      subject { service.result[0] }

      its([:has_pricing_rules_configured]) { is_expected.to be true }
    end
  end
end
