require 'rails_helper'

RSpec.describe Departments::DestroyPolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:passenger)    { create :passenger, company: company }
  let(:department)   { create :department, company: company }

  let(:service) { Departments::Destroy.new(department: department) }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end
end
