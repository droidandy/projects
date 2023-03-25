require 'rails_helper'

RSpec.describe Admin::Documents::InvoicePolicy, type: :policy do
  let(:admin)      { create(:user, :admin) }
  let(:superadmin) { create(:user, :superadmin) }
  let(:sales)      { create(:user, :sales) }

  let(:service) { Documents::Invoice }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(sales) }
  end

  scope do
    it { is_expected.to resolve_to(::Invoice.dataset).for(admin) }
    it { is_expected.to resolve_to(::Invoice.dataset).for(superadmin) }
    it { is_expected.to resolve_to(::Invoice.dataset.nullify).for(sales) }
  end
end
