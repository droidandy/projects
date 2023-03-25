require 'rails_helper'

RSpec.describe ReferenceEntry, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :booking_reference }
    it { is_expected.to validate_presence :value }
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :booking_reference }
  end
end
