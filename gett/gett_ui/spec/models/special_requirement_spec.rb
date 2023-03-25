require 'rails_helper'

RSpec.describe SpecialRequirement, type: :model do
  describe 'associations' do
    it { is_expected.to have_many_to_many(:companies) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence(:key) }
    it { is_expected.to validate_presence(:label) }
    it { is_expected.to validate_presence(:service_type) }
    it { is_expected.to validate_includes(Bookings::Providers::ALL.map(&:to_s), :service_type) }
  end
end
