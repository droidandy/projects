require 'rails_helper'

RSpec.describe Passengers::IndexPolicy, type: :policy do
  let(:company)              { create :company }
  let(:admin)                { create :admin, company: company }
  let(:booker)               { create :booker, company: company, passenger_pks: [passenger.id] }
  let(:passenger)            { create :passenger, company: company }
  let(:assigned_passenger)   { create :passenger, company: company, booker_pks: [admin.id] }
  let(:unassigned_passenger) { create :passenger, company: company }

  let(:service) { Passengers::Index.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :add_passenger? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :have_passenger? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :export_passengers? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  scope do
    preload(:admin, :booker, :assigned_passenger, :unassigned_passenger)

    it { is_expected.to resolve_to([admin, passenger, booker, unassigned_passenger, assigned_passenger]).for(admin) }
    it { is_expected.to resolve_to([passenger, booker]).for(booker) }
    it { is_expected.to resolve_to([passenger]).for(passenger) }

    context 'when booker is assigned to anoother booker' do
      let!(:assigned_booker) { create :booker, company: company, booker_pks: [booker.id] }

      it { is_expected.to resolve_to([assigned_booker]).for(assigned_booker) }
    end

    context 'for bbc company' do
      let(:company) { create(:company, :bbc) }
      let(:full_list) { [admin, booker, passenger, assigned_passenger, unassigned_passenger] }

      it { is_expected.to resolve_to(full_list).for(admin) }
      it { is_expected.to resolve_to([booker, passenger]).for(booker) }
      it { is_expected.to resolve_to([passenger]).for(passenger) }
    end
  end
end
