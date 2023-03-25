require 'rails_helper'

RSpec.describe Bookers::ExportPolicy, type: :policy do
  let(:company)      { create(:company, company_type: company_type) }
  let(:companyadmin) { create(:companyadmin, company: company) }
  let(:admin)        { create(:admin, company: company) }
  let(:booker)       { create(:booker, company: company) }
  let(:passenger)    { create(:passenger, company: company) }
  let(:service)      { Bookers::Export.new }

  permissions :execute? do
    context 'when company is enterprise' do
      let(:company_type) { 'enterprise' }

      it { is_expected.to permit(service).for(companyadmin) }
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    context 'when company is affiliate' do
      let(:company_type) { 'affiliate' }

      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(admin) }
    end
  end
end
