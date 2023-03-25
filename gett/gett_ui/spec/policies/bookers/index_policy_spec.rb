require 'rails_helper'

RSpec.describe Bookers::IndexPolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company, passenger_pks: [passenger.id] }
  let(:passenger)    { create :passenger, company: company }

  let(:service) { Bookers::Index.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }

    context 'for bbc company' do
      let(:company) { create(:company, :bbc) }

      it { is_expected.to permit(service).for(companyadmin) }
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(passenger) }
    end
  end

  permissions :add_booker? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :export_bookers? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  scope do
    preload(:companyadmin, :admin, :booker)

    it { is_expected.to resolve_to([companyadmin, admin, booker]).for(companyadmin) }
    it { is_expected.to resolve_to([companyadmin, admin, booker]).for(admin) }
    it { is_expected.to resolve_to([booker]).for(booker) }
    it { is_expected.to resolve_to([booker]).for(passenger) }

    context 'for bbc company' do
      let(:company) { create(:company, :bbc) }
      let(:full_list) { [companyadmin, admin, booker] }

      it { is_expected.to resolve_to(full_list).for(companyadmin) }
      it { is_expected.to resolve_to(full_list).for(admin) }
      it { is_expected.to resolve_to(full_list).for(booker) }
      it { is_expected.to resolve_to(full_list).for(passenger) }
    end
  end

  scope(:passenger_form) do
    let(:other_booker)   { create :booker, company: company, passenger_pks: [booker.id] }
    let(:another_booker) { create :booker, company: company }

    preload(:companyadmin, :admin, :booker, :other_booker, :another_booker)

    it { is_expected.to resolve_to([booker, other_booker]).for(booker) }
  end
end
