require 'rails_helper'

RSpec.describe TravelRules::UpdatePolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:passenger)    { create :passenger, company: company }
  let(:rule)         { create :travel_rule, company: company }

  let(:service) { TravelRules::Update.new(travel_rule: rule, params: { name: 'new name' }) }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end
end
