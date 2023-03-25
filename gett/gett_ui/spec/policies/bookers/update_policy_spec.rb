require 'rails_helper'

RSpec.describe Bookers::UpdatePolicy, type: :policy do
  let(:company)      { create :company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:other_booker) { create :booker, company: company }

  let(:booker_service)       { service_for booker }
  let(:other_booker_service) { service_for other_booker }

  permissions :execute? do
    it { is_expected.to permit(booker_service).for(admin) }
    it { is_expected.to permit(booker_service).for(booker) }
    it { is_expected.not_to permit(other_booker_service).for(booker) }
  end

  permissions :update_role? do
    it { is_expected.to permit(booker_service).for(admin) }
    it { is_expected.not_to permit(booker_service).for(booker) }
    it { is_expected.not_to permit(other_booker_service).for(booker) }
  end

  def service_for(booker)
    Bookers::Update.new(booker: booker, params: {first_name: 'foo'})
  end
end
