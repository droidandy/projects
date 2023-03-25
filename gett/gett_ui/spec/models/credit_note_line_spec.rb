require 'rails_helper'

RSpec.describe CreditNoteLine, type: :model do
  describe 'associations' do
    it { is_expected.to have_many_to_one :credit_note }
    it { is_expected.to have_many_to_one :booking }
  end

  describe 'validations' do
    it { is_expected.to validate_presence :credit_note_id }
    it { is_expected.to validate_presence :booking_id }
  end

  describe '#vat, #total_amount_cents' do
    subject(:line) { create(:credit_note_line, :vatable, amount_cents: 100) }

    it { is_expected.to be_vatable }
    its(:total_amount_cents) { is_expected.to eq 120 }
  end
end
