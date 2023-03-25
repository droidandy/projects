require 'rails_helper'

RSpec.describe Location, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_presence :company_id }
    it { is_expected.to validate_presence :address_id }
    it { is_expected.to validate_unique :name }
    it { is_expected.to validate_unique :address }
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :company }
    it { is_expected.to have_many_to_one :address }
  end
end
