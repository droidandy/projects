require 'rails_helper'

RSpec.describe Role, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_includes Role::ROLES, :name }
  end

  describe 'associations' do
    it { is_expected.to have_one_to_many :members }
    it { is_expected.to have_one_to_many :users }
  end
end
