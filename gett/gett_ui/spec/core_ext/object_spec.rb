require 'rails_helper'

RSpec.describe Object do
  describe '#yield_self' do
    it 'yields self and returns block result' do
      expect('foo'.yield_self(&:upcase)).to eq('FOO')
    end
  end
end
