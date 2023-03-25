require 'rails_helper'

RSpec.describe Statements::Parser do
  describe '#as_json' do
    let(:hash) do
      JSON.parse(json_body('gett/finance_portal_api/statements')).first
    end

    subject { described_class.new(hash).parse }

    it 'returns json' do
      expect(subject).to eq(
        adjustments: 15.5,
        cash:        7,
        commission:  36.08,
        earnings:    380.07,
        fees:        43.28,
        from:        '2017-01-01T00:00:00+00:00',
        id:          3016373,
        rides:       390.31,
        tips:        15.54,
        to:          '2017-11-05T23:59:59+00:00',
        total:       373.07,
        vat:         7.2,
        week_number: 52
      )
    end
  end
end
