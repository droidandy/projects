require 'rails_helper'

RSpec.describe Department, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_unique :name }
  end

  describe 'associations' do
    it { is_expected.to have_one_to_many :members }
    it { is_expected.to have_many_to_one :company }

    describe 'dependencies' do
      let(:company)    { create :company }
      let(:department) { create :department, company: company }
      let(:booker)     { create :booker, company: company, department: department }

      specify do
        expect{ department.destroy }.to change{ booker.department(reload: true) }.to(nil)
      end
    end
  end
end
