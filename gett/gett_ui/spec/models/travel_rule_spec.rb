require 'rails_helper'

RSpec.describe TravelRule, type: :model do
  let(:company) { create :company }

  describe 'associations' do
    it { is_expected.to have_many_to_one  :company }
    it { is_expected.to have_many_to_many :members }
    it { is_expected.to have_many_to_many :departments }
    it { is_expected.to have_many_to_many :work_roles }
    it { is_expected.to have_many_to_many :vehicles }
  end

  describe 'validations' do
    let(:member)     { create(:member, company: company) }
    let(:department) { create(:department, company: company) }
    let(:work_role)  { create(:work_role, company: company) }
    let(:vehicle)    { create(:vehicle, :gett, name: 'vehicle') }
    let(:ot_vehicle) { create(:vehicle, :one_transport, name: 'vehicle1') }

    it { is_expected.to validate_presence :name }

    describe 'any_user_scope validation' do
      subject do
        build :travel_rule, company: company, members: [], vehicles: [vehicle]
      end

      context 'when member_pks is blank' do
        it { is_expected.not_to be_valid }
      end

      context 'when member_pks is set' do
        before { subject.member_pks = [member.id] }

        it { is_expected.to be_valid }
      end

      context 'when department_pks is set' do
        before { subject.department_pks = [department.id] }

        it { is_expected.to be_valid }
      end

      context 'when work_role_pks is set' do
        before { subject.work_role_pks = [work_role.id] }

        it { is_expected.to be_valid }
      end

      context 'when allow_unregistered is true' do
        subject { build :travel_rule, :allow_unregistered }

        it { is_expected.to be_valid }
      end
    end

    describe 'cheapest validation' do
      subject do
        build :travel_rule, company: company, cheapest: true, vehicles: [vehicle]
      end

      context 'when one vehicle is selected' do
        it { is_expected.not_to be_valid }
      end

      context 'when two vehicles are selected' do
        before { subject.vehicle_pks.push(ot_vehicle.id) }

        it { is_expected.to be_valid }
      end
    end
  end
end
