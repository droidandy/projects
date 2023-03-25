require 'rails_helper'

RSpec.describe JsonWebToken do
  describe '.encode + .decode' do
    it 'returns initial payload' do
      initial_payload = HashWithIndifferentAccess.new(id: 1, name: 'Name')

      token = described_class.encode(initial_payload)
      decoded_payload = described_class.decode(token)

      expect(decoded_payload).to eq initial_payload
    end
  end
end
