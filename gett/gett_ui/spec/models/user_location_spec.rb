require 'rails_helper'

RSpec.describe UserLocation do
  it { is_expected.to have_many_to_one :user }
end
