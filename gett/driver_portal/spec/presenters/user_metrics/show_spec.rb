require 'rails_helper'


RSpec.describe UserMetrics::Show do
  subject { described_class.new(user_data) }

  let(:user_data) do
    {
      id: 10,
      license_number: 'LV02 HJN',
      rating: 4.93,
      today_acceptance: 14,
      week_acceptance: 0,
      month_acceptance: 77,
      total_acceptance: 42
    }
  end

  describe '#as_json' do
    let(:json) do
      {
        rating: user_data[:rating],
        today_acceptance: user_data[:today_acceptance],
        week_acceptance: user_data[:week_acceptance],
        month_acceptance: user_data[:month_acceptance],
        total_acceptance: user_data[:total_acceptance]
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end
  end
end
