require 'rails_helper'

RSpec.describe Passengers::UpdatePolicy, type: :policy do
  let(:company)         { create(:company) }
  let(:companyadmin)    { create(:companyadmin, company: company) }
  let(:admin)           { create(:admin, company: company) }
  let(:booker)          { create(:booker, company: company, passenger_pks: [passenger.id]) }
  let(:other_booker)    { create(:booker, company: company) }
  let(:passenger)       { create(:passenger, company: company) }
  let(:other_passenger) { create(:passenger, company: company) }

  let(:service) { Passengers::Update.new(passenger: passenger, params: {first_name: 'foo'}) }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(other_booker) }
    it { is_expected.to permit(service).for(passenger) }
    it { is_expected.not_to permit(service).for(other_passenger) }
  end

  permissions :assign_self? do
    context 'no bookers assigned' do
      let(:booker) { create(:booker, company: company) }

      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end

    context 'booker already assigned' do
      let(:booker)    { create(:booker, company: company) }
      let(:passenger) { create(:passenger, company: company, booker_pks: [booker.id]) }

      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end
  end

  permissions :change_personal_card_usage? do
    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }
      let(:booker) { create(:booker, company: company) }

      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end
  end

  describe '#permitted_passenger_params' do
    let(:policy) { Passengers::UpdatePolicy.new(member, service) }
    let(:member) { booker }
    let(:permitted_params) { [:email, :work_role_id, :department_id, :payroll, :cost_centre, :division, :booker_pks] }

    subject(:permitted_passenger_params) { policy.permitted_passenger_params }

    it { is_expected.not_to include(:booker_pks) }

    context 'when member is executive' do
      let(:member) { admin }

      it { is_expected.to include(*permitted_params) }
    end

    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }

      context 'when member is a passenger' do
        let(:member) { passenger }

        it { is_expected.to include(*permitted_params) }
      end

      context 'when member is a other passenger' do
        let(:member) { other_passenger }

        it { is_expected.to_not include(*permitted_params) }
      end
    end
  end
end
