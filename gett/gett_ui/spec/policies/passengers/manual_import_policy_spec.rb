require 'rails_helper'

RSpec.describe Passengers::ManualImportPolicy, type: :policy do
  let(:company) { create(:company) }

  let(:companyadmin) { create(:companyadmin, company: company) }
  let(:admin)        { create(:admin, company: company) }
  let(:booker)       { create(:booker, company: company) }
  let(:passenger)    { create(:passenger, company: company) }

  let(:service)      { Passengers::ManualImport.new(params: {}) }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  context 'BBC company' do
    let(:company) { create(:company, :bbc) }

    permissions :execute? do
      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(admin) }
    end
  end
end
