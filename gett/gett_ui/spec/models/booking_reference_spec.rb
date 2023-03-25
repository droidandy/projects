require 'rails_helper'

RSpec.describe BookingReference, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :company }

    describe 'name validation' do
      let(:company)                   { create :company }
      let(:valid_booking_reference_1) { build :booking_reference, company: company, name: 'name' }
      let(:valid_booking_reference_2) { build :booking_reference, :inactive, company: company, name: nil }
      let(:invalid_booking_reference) { build :booking_reference, company: company, name: nil }

      it 'validates name presence if active' do
        expect(valid_booking_reference_1).to be_valid
        expect(valid_booking_reference_2).to be_valid
        expect(invalid_booking_reference).not_to be_valid
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :company }
    it { is_expected.to have_one_to_many :reference_entries }
    it { is_expected.to have_one_to_many :booker_references }
  end
end
