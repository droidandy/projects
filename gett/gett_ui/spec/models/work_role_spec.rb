require 'rails_helper'

RSpec.describe WorkRole, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_unique :name }
  end

  describe 'associations' do
    it { is_expected.to have_one_to_many :members }
    it { is_expected.to have_many_to_one :company }

    describe 'dependencies' do
      let(:company)   { create :company }
      let(:work_role) { create :work_role, company: company }
      let(:booker)    { create :booker, company: company, work_role: work_role }

      specify do
        expect{ work_role.destroy }.to change{ booker.work_role(reload: true) }.to(nil)
      end
    end
  end
end
