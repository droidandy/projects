require 'rails_helper'

RSpec.describe UserDevice do
  it { is_expected.to have_many_to_one :user }
end
