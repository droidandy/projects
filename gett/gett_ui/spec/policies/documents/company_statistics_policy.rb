require 'rails_helper'

RSpec.describe Documents::CompanyStatisticsPolicy, type: :policy do
  let(:admin) { create :user, :admin }
  let(:superadmin) { create :user, :superadmin }
  let(:sales) { create :user, :sales }

  let(:company) { create :company }
  let(:company_admin) { create(:admin, company: company) }
  let(:company_companyadmin) { create(:companyadmin, company: company) }
  let(:company_finance) { create(:finance, company: company) }
  let(:company_booker) { create(:booker, company: company) }

  let(:service) { Documents::CompanyStatistics }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.to permit(service).for(company_admin) }
    it { is_expected.to permit(service).for(company_companyadmin) }
    it { is_expected.not_to permit(service).for(company_finance) }
    it { is_expected.not_to permit(service).for(company_booker) }
  end
end
