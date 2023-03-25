require 'rails_helper'

RSpec.describe Admin::Bookings::PricingForm, type: :service do
  describe '#execute' do
    let(:company)   { create(:company) }
    let(:booker)    { create(:user, :admin) }
    let(:passenger) { create(:passenger, company: company) }
    let(:booking)   { create(:booking, company_info: company.company_info, total_cost: 1.1, passenger: passenger, booker: booker) }
    let(:service)   { Admin::Bookings::PricingForm.new(booking: booking) }

    subject(:result) { service.execute.result.with_indifferent_access }

    it { is_expected.to include(:bookers, :form, :can) }

    describe '[:can][:edit]' do
      context 'when booking is billed' do
        before { allow(booking).to receive(:billed?).and_return(true) }

        its([:can, :edit]) { is_expected.to be false }
      end

      context 'when booking is not billed' do
        before { allow(booking).to receive(:billed?).and_return(false) }

        its([:can, :edit]) { is_expected.to be true }
      end
    end

    describe '[:bookers]' do
      it "contains booking's booker info, even if it's not company booker (i.e. BO user)" do
        expect(result[:bookers]).to include(hash_including('id' => booker.id))
      end
    end
  end
end
