require 'rails_helper'

RSpec.describe TravelReason, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_unique :name }
  end

  describe 'associations' do
    it { is_expected.to have_one_to_many :bookings }
    it { is_expected.to have_many_to_one :company }

    describe 'dependencies' do
      let(:reason)  { create :travel_reason }
      let(:booking) { create :booking, travel_reason: reason }

      specify do
        expect{ reason.destroy }.to change{ booking.travel_reason(reload: true) }.to(nil)
      end
    end
  end
end
