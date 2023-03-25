require 'rails_helper'

RSpec.describe CompanyInfo, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence(:name) }
    it { is_expected.to validate_max_length(60, :name) }
    it { is_expected.to validate_format(Sequel::Plugins::ApplicationModel::USER_NAME_FORMAT, :name) }
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one(:company) }
    it { is_expected.to have_many_to_one(:address) }
    it { is_expected.to have_many_to_one(:legal_address) }
    it { is_expected.to have_many_to_one(:salesman) }
    it { is_expected.to have_many_to_one(:account_manager) }
  end
end
