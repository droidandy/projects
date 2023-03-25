require 'rails_helper'

RSpec.describe CompanyCreditRate, type: :model do
  describe 'associations' do
    it { is_expected.to have_many_to_one(:company) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence(:company) }
  end

  describe '#inactivate!' do
    let(:company_credit_rate) { create(:company_credit_rate, :active) }

    it 'changes active to false' do
      expect { company_credit_rate.inactivate! }
        .to change(company_credit_rate, :active).to(false)
    end
  end
end
