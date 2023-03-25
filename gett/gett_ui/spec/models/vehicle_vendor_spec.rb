require 'rails_helper'

RSpec.describe VehicleVendor, type: :model do
  it { is_expected.to validate_presence(:key) }
  it { is_expected.to validate_presence(:name) }

  it { is_expected.to have_one_to_many(:bookings) }
  it { is_expected.to have_many_to_many(:vehicles) }
end
