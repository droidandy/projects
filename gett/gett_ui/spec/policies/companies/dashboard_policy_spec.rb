require 'rails_helper'

RSpec.describe Companies::DashboardPolicy, type: :policy do
  let(:company)   { create(:company) }
  let(:admin)     { create(:admin, company: company) }
  let(:finance)   { create(:finance, company: company) }
  let(:passenger) { create(:passenger, company: company) }
  let(:booker)    { create(:booker, company: company, passenger_pks: [passenger.id]) }

  let(:service) { Companies::Dashboard.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :edit? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(finance) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  describe 'scope(:bookings)' do
    it 'delegates to Bookings::IndexPolicy' do
      expect(Bookings::IndexPolicy).to receive(:scope).and_call_original

      described_class.scope(:bookings).call(admin)
    end

    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }

      scope(:bookings) do
        let(:personal_booking) { create(:booking, company: company, passenger: admin) }
        let(:foreign_booking) { create(:booking, company: company, passenger: booker) }

        preload(:personal_booking, :foreign_booking)

        it { is_expected.to resolve_to([personal_booking]).for(admin) }
      end
    end
  end
end
