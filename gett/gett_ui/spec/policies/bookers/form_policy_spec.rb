require 'rails_helper'

RSpec.describe Bookers::FormPolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:other_admin)  { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:other_booker) { create :booker, company: company }
  let(:passenger)    { create :passenger, company: company }

  let(:service) { Bookers::Form.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :edit_all? do
    let(:affiliate_company) { create :company, company_type: 'affiliate' }
    let(:affiliate_admin)   { create :admin, company: affiliate_company }

    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }

    it { is_expected.not_to permit(service).for(affiliate_admin) }
  end

  permissions :change_role? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :assign_passengers? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :change_active? do
    context 'with given booker' do
      context 'for admin himself' do
        let(:service) { Bookers::Form.new(booker: companyadmin) }
        it { is_expected.not_to permit(service).for(companyadmin) }
      end

      let(:service) { Bookers::Form.new(booker: admin) }

      it { is_expected.to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    context 'without booker' do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  permissions :see_log? do
    let(:service) { Bookers::Form.new(booker: booker) }

    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(other_booker) }
    it { is_expected.not_to permit(service).for(passenger) }

    context 'bbc company' do
      let(:company) { create(:company, :bbc) }
      let(:service) { Bookers::Form.new(booker: booker) }

      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  scope(:passengers) do
    let(:other_booker)       { create :booker, company: company }
    let(:passenger)          { create :passenger, company: company }
    let(:assigned_passenger) { create :passenger, company: company, booker_pks: [booker.id] }
    let(:other_passenger)    { create :passenger, company: company, booker_pks: [other_booker.id] }
    let(:inactive_passenger) { create :passenger, company: company, booker_pks: [other_booker.id], active: false }

    preload(:passenger, :assigned_passenger, :other_passenger, :inactive_passenger)

    it { is_expected.to resolve_to([passenger, booker, assigned_passenger, other_booker, other_passenger, companyadmin]).for(companyadmin) }
    it { is_expected.to resolve_to([passenger, booker, assigned_passenger, other_booker, other_passenger, companyadmin, admin]).for(admin) }
    it { is_expected.to resolve_to([passenger, booker, assigned_passenger, other_booker]).for(booker) }
  end
end
