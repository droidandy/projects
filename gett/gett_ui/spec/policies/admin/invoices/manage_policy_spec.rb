require 'rails_helper'

RSpec.describe Admin::Invoices::ManagePolicy, type: :policy do
  let(:superadmin)    { build(:user, :superadmin) }
  let(:admin)         { build(:user, :admin) }
  let(:sales)         { build(:user, :sales) }
  let(:customer_care) { build(:user, :customer_care) }
  let(:member)        { build(:admin) }
  let(:invoice)       { build(:invoice) }
  let(:service)       { Admin::Invoices::MarkAsPaid.new(invoice: invoice) }

  permissions :execute? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end
end
