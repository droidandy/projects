require 'rails_helper'

RSpec.describe Admin::Companies::ToggleStatusPolicy, type: :policy do
  let(:company)       { create :company }
  let(:superadmin)    { create :user, :superadmin }
  let(:admin)         { create :user, :admin }
  let(:sales)         { create :user, :sales }
  let(:customer_care) { create :user, :customer_care }
  let(:member)        { create :admin, company: company }

  permissions :execute? do
    it { is_expected.to     permit(service).for(superadmin) }
    it { is_expected.to     permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  def service
    Admin::Companies::ToggleStatus.new(company: company)
  end
end
