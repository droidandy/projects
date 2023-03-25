require 'rails_helper'


RSpec.describe Errors do
  subject { described_class.new(errors) }

  let(:errors) do
    {
      user: [
        'is blocked',
        'Has bad photo'
      ],
      another_reason: [
        'is broken too'
      ],
      base: 'Very long description of the error'
    }
  end

  describe '#as_json' do

    it 'returns proper json' do
      expect(subject.as_json).to eq(
        {
          errors: {
            user: [
              'User is blocked',
              'User has bad photo'
            ],
            another_reason: [
              'Another reason is broken too'
            ],
            base: [
              'Very long description of the error'
            ]
          }
        }
      )
    end
  end
end
