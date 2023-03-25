require 'rails_helper'

RSpec.describe Bookings::FetchJourneyTypes, type: :service do
  subject { described_class.new(company: company, passenger: passenger).execute.result }

  let(:passenger) { nil }

  context 'when company is not bbc' do
    let(:company) { create(:company) }

    it { is_expected.to eq([]) }
  end

  context 'when company is bbc' do
    let(:company) { create(:company, :bbc) }

    context 'when passenger is blank' do
      it { is_expected.to eq([Booking::BBC::JourneyType::WW]) }
    end

    context 'when passenger does not have full PD' do
      let(:passenger) { create(:passenger, :bbc_staff, company: company) }

      it { is_expected.to eq([Booking::BBC::JourneyType::WW]) }
    end

    context 'when passenger does not have full PD' do
      let(:passenger) { create(:passenger, :bbc_full_pd, company: company) }

      it { is_expected.to eq(Booking::BBC::JourneyType::ALL_TYPES) }
    end
  end
end
