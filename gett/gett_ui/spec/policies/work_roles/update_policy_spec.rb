require 'rails_helper'

RSpec.describe WorkRoles::UpdatePolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:passenger)    { create :passenger, company: company }
  let(:work_role)    { create :work_role, company: company }

  let(:service) { WorkRoles::Update.new(work_role: work_role, params: {name: 'role'}) }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end
end
