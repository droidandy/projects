require 'rails_helper'

RSpec.describe Companies::SyncSpecialRequirements, type: :service do
  let(:company) { create(:company, :enterprise) }
  let(:special_req) { create(:special_requirement, :ot, key: 'Key 1', label: 'Label 1') }

  let(:special_reqs_result) do
    {
      requirements: [
        { key: 'Key 1', label: 'Label 1', service_type: 'ot' },
        { key: 'Key 2', label: 'Label 2', service_type: 'ot' }
      ]
    }
  end

  subject(:service) { described_class.new(company: company) }

  describe '#execute' do
    before do
      company.add_special_requirement(special_req)

      allow(OneTransport::ClientLookup).to receive(:new)
        .with(company: company)
        .and_return(
          double(execute: double(normalized_response: special_reqs_result))
        )
    end

    it 'creates missed special requirement' do
      expect { service.execute }.to change(SpecialRequirement, :count).from(1).to(2)
    end

    it 'adds special requirement to company' do
      expect(company.special_requirements.count).to eq(1)

      service.execute

      expect(company.special_requirements.count).to eq(2)
    end
  end
end
