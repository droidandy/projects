require 'rails_helper'

RSpec.describe Passengers::ShowPolicy, type: :policy do
  let(:company)         { create(:company) }
  let(:admin)           { create(:admin, company: company) }
  let(:booker)          { create(:booker, company: company) }
  let(:passenger)       { create(:passenger, company: company) }
  let(:finance)         { create(:finance, company: company) }
  let(:other_passenger) { create(:passenger, company: company) }

  let(:service) { Passengers::Show.new(passenger: passenger) }

  permissions :execute? do
    context 'when passenger is unassigned' do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(finance) }
      it { is_expected.to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end

    context 'when passenger is assigned to booker(s)' do
      let!(:booker)      { create(:booker, company: company, passenger_pks: [passenger.id]) }
      let(:other_booker) { create(:booker, company: company) }

      # reload passenger to drop it's booker_pks
      before { passenger.reload }

      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
    end

    context 'when bbc company' do
      let(:company) { create(:company, :bbc) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(finance) }
      it { is_expected.to permit(service).for(passenger) }
      it { is_expected.to permit(service).for(other_passenger) }
    end
  end

  permissions :be_expanded? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
    it { is_expected.to permit(service).for(other_passenger) }

    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end
  end
end
