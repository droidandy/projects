require 'rails_helper'

RSpec.describe Sessions::CurrentPolicy, type: :policy do
  let(:company)      { create(:company) }
  let(:companyadmin) { create(:companyadmin, company: company) }
  let(:admin)        { create(:admin, company: company) }
  let(:booker)       { create(:booker, company: company) }
  let(:finance)      { create(:finance, company: company) }
  let(:passenger)    { create(:passenger, company: company) }

  let(:service) { Sessions::Current.new }

  permissions :execute?, :export_bookings? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :see_bookers? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(passenger) }

    context 'for bbc company' do
      let(:company) { create(:company, :bbc) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(finance) }
      it { is_expected.to permit(service).for(passenger) }
    end
  end

  permissions :create_passengers? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :administrate_company? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :manage_finance?, :manage_report_settings? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :manage_travel_policies?, :manage_travel_reasons? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :export_receipts? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.to permit(service).for(passenger) }
  end

  context 'BBC company' do
    let(:company) { create(:company, :bbc) }

    permissions :manage_travel_policies?, :manage_travel_reasons? do
      it { is_expected.not_to permit(service).for(admin) }
    end

    permissions :export_bookings? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(finance) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    permissions :export_receipts? do
      it { is_expected.not_to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(finance) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end
end
