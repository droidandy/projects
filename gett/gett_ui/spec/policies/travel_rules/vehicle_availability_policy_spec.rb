require 'rails_helper'

RSpec.describe TravelRules::VehicleAvailabilityPolicy, type: :policy do
  let(:admin)                    { create(:user, :admin) }
  let(:sales)                    { create(:user, :sales) }
  let(:customer_care)            { create(:user, :customer_care) }
  let(:outsourced_customer_care) { create(:user, :outsourced_customer_care) }

  let(:service) { TravelRules::VehicleAvailability.new(with_manual: true) }

  permissions :allow_manual? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(sales) }
    it { is_expected.to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(outsourced_customer_care) }
  end
end
