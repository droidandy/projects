require 'rails_helper'

RSpec.describe CompanyComment, type: :model do
  describe 'associations' do
    it { is_expected.to have_many_to_one :author }
    it { is_expected.to have_many_to_one :company }
  end

  describe 'validations' do
    it { is_expected.to validate_presence :company }
  end
end
