require 'rails_helper'

RSpec.describe Ddi, type: :model do
  describe 'associations' do
    it { is_expected.to have_one_to_many :companies }
  end

  describe '.fetch' do
    let!(:ddi) { create(:ddi, :mega, phone: '123') }

    it 'returns DDI record of corresponding type' do
      expect(Ddi.fetch(:mega)).to eq(ddi)
    end
  end
end
