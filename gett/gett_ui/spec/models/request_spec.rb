require 'rails_helper'

RSpec.describe Request do
  it { is_expected.to validate_presence :url }
end
