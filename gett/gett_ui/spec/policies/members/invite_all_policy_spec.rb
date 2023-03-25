require 'rails_helper'

RSpec.describe Members::InviteAllPolicy, type: :policy do
  let(:companyadmin) { build(:companyadmin) }
  let(:booker)       { build(:booker) }
  let(:passenger)    { build(:passenger) }
  let(:admin)        { build(:admin) }

  let(:service) { Members::InviteAll.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }

    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end
end
