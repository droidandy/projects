require 'rails_helper'

RSpec.describe DirectDebitMandates::Policy, type: :policy do
  let(:company)       { create(:company) }
  let(:admin)         { create(:admin, company: company) }
  let(:finance)       { create(:finance, company: company) }
  let(:travelmanager) { create(:travelmanager, company: company) }
  let(:booker)        { create(:booker, company: company) }
  let(:passenger)     { create(:passenger, company: company) }

  let(:service) { DirectDebitMandates::Create.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.to permit(service).for(travelmanager) }
    it { is_expected.to_not permit(service).for(booker) }
    it { is_expected.to_not permit(service).for(passenger) }
  end
end
