require 'rails_helper'

RSpec.describe BookingSchedule, type: :model do
  describe 'associations' do
    it { is_expected.to have_one_to_many :bookings }
  end

  describe 'validations' do
    it { is_expected.to validate_presence :scheduled_ats }
  end
end
