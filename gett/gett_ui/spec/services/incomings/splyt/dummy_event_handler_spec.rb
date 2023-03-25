require 'rails_helper'

RSpec.describe Incomings::Splyt::DummyEventHandler do
  subject(:service) { described_class.new }

  describe '#execute' do
    it 'returns true' do
      expect(service.execute.result).to be true
    end
  end
end
