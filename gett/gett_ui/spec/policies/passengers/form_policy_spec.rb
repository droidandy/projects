require 'rails_helper'

RSpec.describe Passengers::FormPolicy, type: :policy do
  let(:company)         { create :company }
  let(:admin)           { create :admin, company: company }
  let(:companyadmin)    { create :companyadmin, company: company }
  let(:booker)          { create :booker, company: company }
  let(:other_booker)    { create :booker, company: company }
  let(:passenger)       { create :passenger, company: company, booker_pks: [booker.id] }
  let(:other_passenger) { create :passenger, company: company, booker_pks: [other_booker.id] }

  let(:service) { Passengers::Form.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :assign_bookers? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :change_wheelchair? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :change_role? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :change_active? do
    context 'with given passenger' do
      let(:service) { Passengers::Form.new(passenger: passenger) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    context 'without passenger' do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  permissions :assign_self? do
    context 'new passenger form' do
      it { is_expected.not_to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    context 'edit passenger' do
      let(:service) { Passengers::Form.new(passenger: passenger) }

      context 'no bookers assigned' do
        let(:booker)    { create :booker, company: company }
        let(:passenger) { create :passenger, company: company }

        it { is_expected.not_to permit(service).for(admin) }
        it { is_expected.to permit(service).for(booker) }
        it { is_expected.not_to permit(service).for(passenger) }
      end

      context 'booker already assigned' do
        let(:booker)    { create :booker, company: company }
        let(:passenger) { create :passenger, company: company, booker_pks: [booker.id] }

        it { is_expected.not_to permit(service).for(admin) }
        it { is_expected.to permit(service).for(booker) }
        it { is_expected.not_to permit(service).for(other_booker) }
        it { is_expected.not_to permit(service).for(passenger) }
      end

      permissions :see_log? do
        it { is_expected.to permit(service).for(companyadmin) }
        it { is_expected.to permit(service).for(admin) }
        it { is_expected.not_to permit(service).for(booker) }
        it { is_expected.not_to permit(service).for(other_booker) }
        it { is_expected.not_to permit(service).for(passenger) }
        it { is_expected.not_to permit(service).for(other_passenger) }
      end
    end
  end

  permissions :accept_pd? do
    it { is_expected.not_to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :change_pd? do
    it { is_expected.not_to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  context 'bbc company' do
    let(:company) { create(:company, :bbc) }

    permissions :edit_bbc_attrs? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    permissions :change_wheelchair? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    permissions :assign_bookers? do
      context 'with given passenger' do
        let(:service) { Passengers::Form.new(passenger: passenger) }

        it { is_expected.to permit(service).for(admin) }
        it { is_expected.not_to permit(service).for(booker) }
        it { is_expected.to permit(service).for(passenger) }
      end
    end

    permissions :see_log? do
      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end

    available_permission = %i(change_email? change_department? change_work_role? change_payroll? change_cost_centre? change_division?)
    permissions(*available_permission) do
      context 'with given passenger' do
        let(:service) { Passengers::Form.new(passenger: passenger) }

        it { is_expected.to permit(service).for(admin) }
        it { is_expected.not_to permit(service).for(booker) }
        it { is_expected.not_to permit(service).for(other_booker) }
        it { is_expected.to permit(service).for(passenger) }
      end
    end

    permissions :accept_pd? do
      context 'passenger blank' do
        it { is_expected.not_to permit(service).for(admin) }
        it { is_expected.not_to permit(service).for(booker) }
        it { is_expected.not_to permit(service).for(passenger) }
      end

      context 'with given passenger' do
        let(:service) { Passengers::Form.new(passenger: passenger) }

        it { is_expected.not_to permit(service).for(admin) }
        it { is_expected.not_to permit(service).for(booker) }
        it { is_expected.to permit(service).for(passenger) }
      end
    end

    permissions :change_pd? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  available_permission = %i(change_email? change_department? change_work_role? change_payroll? change_cost_centre? change_division?)
  permissions(*available_permission) do
    context 'with given passenger' do
      let(:service) { Passengers::Form.new(passenger: passenger) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    context 'without passenger' do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  permissions :add_payment_cards?, :delete_payment_cards? do
    context 'when company has passenger_payment_card payment method' do
      let(:company) { create :company, payment_types: ['account', 'passenger_payment_card'] }
      let(:service) { Passengers::Form.new(passenger: passenger) }

      it { is_expected.to permit(service).for(passenger) }

      describe 'when not passenger, delegates to :assign_self? policy check' do
        context 'when :assign_self? returns true' do
          before { expect_any_instance_of(policy).to receive(:assign_self?).and_return(true) }

          it { is_expected.to permit(service).for(other_booker) }
        end

        context 'when :assign_self? returns false' do
          before { expect_any_instance_of(policy).to receive(:assign_self?).and_return(false) }

          it { is_expected.not_to permit(service).for(other_booker) }
        end
      end
    end

    context 'when company does not have passenger_payment_card payment method' do
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  scope(:bookers) do
    let(:inactive_booker) { create :booker, company: company, passenger_pks: [passenger.id], active: false }
    preload(:companyadmin, :admin, :booker, :inactive_booker)

    it { is_expected.to resolve_to([companyadmin, admin, booker]).for(companyadmin) }
    it { is_expected.to resolve_to([companyadmin, admin, booker]).for(admin) }
    it { is_expected.to resolve_to([booker]).for(booker) }
    it { is_expected.to resolve_to([booker]).for(passenger) }
  end
end
