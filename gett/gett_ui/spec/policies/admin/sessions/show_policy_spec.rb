require 'rails_helper'

RSpec.describe Admin::Sessions::ShowPolicy, type: :policy do
  let(:superadmin)               { create :user, :superadmin }
  let(:admin)                    { create :user, :admin }
  let(:sales)                    { create :user, :sales }
  let(:customer_care)            { create :user, :customer_care }
  let(:outsourced_customer_care) { create :user, :outsourced_customer_care }
  let(:member)                   { create :admin, company: create(:company) }

  let(:service) { Admin::Sessions::Show.new }

  permissions :see_notifications? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.not_to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :see_statistics? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :see_predefined_addresses? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.not_to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :see_system_settings? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.not_to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :see_billing? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :create_users? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :edit_companies? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  permissions :manage_bookings_without_authorization? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(sales) }
    it { is_expected.not_to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(outsourced_customer_care) }
  end

  permissions :see_users? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(sales) }
    it { is_expected.to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(outsourced_customer_care) }
  end
end
