require 'rails_helper'

RSpec.describe CsvReports::Policy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:passenger)    { create :passenger, company: company }
  let(:finance)      { create :finance, company: company }

  let(:service) { CsvReports::Create.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end
end
