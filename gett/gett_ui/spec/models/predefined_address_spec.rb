require 'rails_helper'

RSpec.describe PredefinedAddress, type: :model do
  describe '#match' do
    context 'special characters' do
      let(:query) { "query # query &" }

      it 'does not raise error if query containts special character' do
        expect{ PredefinedAddress.match(query).all }.not_to raise_error
      end
    end
  end
end
