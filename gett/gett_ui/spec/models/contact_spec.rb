require 'rails_helper'

RSpec.describe Contact, type: :model do
  describe 'associations' do
    it { is_expected.to have_many_to_one :company }
    it { is_expected.to have_many_to_one :address }
    it { is_expected.to have_one_to_many :company_infos }
  end

  describe 'validations' do
    it { is_expected.to validate_presence :company_id }
  end
end
