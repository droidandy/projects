require 'rails_helper'

RSpec.describe Bookers::ShowPolicy, type: :policy do
  let(:company)      { create(:company) }
  let(:companyadmin) { create(:companyadmin, company: company) }
  let(:admin)        { create(:admin, company: company) }
  let(:booker)       { create(:booker, company: company) }
  let(:passenger)    { create(:passenger, company: company) }
  let(:other_booker) { create(:booker, company: company) }

  let(:service)      { Bookers::Show.new(booker: booker) }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
    it { is_expected.not_to permit(service).for(other_booker) }
  end

  permissions :be_expanded? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
    it { is_expected.to permit(service).for(other_booker) }

    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }

      it { is_expected.to permit(service).for(companyadmin) }
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_booker) }
    end
  end
end
