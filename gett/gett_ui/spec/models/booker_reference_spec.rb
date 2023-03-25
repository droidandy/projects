require 'rails_helper'

RSpec.describe BookerReference, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :booking_id }
    it { is_expected.to validate_presence :booking_reference_name }

    describe '#validate_value' do
      let(:company)                      { create :company }
      let(:booking)                      { create :booking }
      let!(:validated_booking_reference) { create :booking_reference, :validation_required, company: company }
      let(:ref_entry_value)              { '123' }
      let!(:reference_entry)             { create :reference_entry, booking_reference: validated_booking_reference, value: ref_entry_value }
      let!(:optional_booking_reference)  { create :booking_reference, company: company }
      let(:invalid_booker_reference_1)   { build :booker_reference, booking_id: booking.id, booking_reference: optional_booking_reference, value: nil }
      let(:invalid_booker_reference_2)   { build :booker_reference, booking_id: booking.id, booking_reference: validated_booking_reference, value: 'wrong_value' }
      let(:valid_booker_reference_1)     { build :booker_reference, booking_id: booking.id, booking_reference: optional_booking_reference, value: 'any value' }
      let(:valid_booker_reference_2)     { build :booker_reference, booking_id: booking.id, booking_reference: validated_booking_reference, value: '123' }

      context 'invalid attributes' do
        it 'validates properly' do
          expect(invalid_booker_reference_1).not_to be_valid
          expect(invalid_booker_reference_2).not_to be_valid
        end
      end

      context 'valid attributes' do
        it 'validates properly' do
          expect(valid_booker_reference_1).to be_valid
          expect(valid_booker_reference_2).to be_valid
        end
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :booking }
  end
end
