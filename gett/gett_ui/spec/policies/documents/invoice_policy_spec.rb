require 'rails_helper'

RSpec.describe Documents::InvoicePolicy, type: :policy do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }
  let(:finance) { create(:finance, company: company) }
  let(:booker)  { create(:booker, company: company) }

  let(:service) { Documents::Invoice }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.to permit(service).for(booker) }
  end

  scope do
    it { is_expected.to resolve_to(company.invoices_dataset).for(admin) }
    it { is_expected.to resolve_to(company.invoices_dataset).for(finance) }
    it { is_expected.to resolve_to(::Invoice.dataset.nullify).for(booker) }
  end
end
