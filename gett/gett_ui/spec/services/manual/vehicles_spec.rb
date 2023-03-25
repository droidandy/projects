require 'rails_helper'

RSpec.describe Manual::Vehicles, type: :service do
  let(:allowed_services) { [] }
  let(:booking) { build(:booking, vehicle: create(:vehicle, :manual)) }

  subject(:service) { described_class.new(allowed_services: allowed_services) }

  service_context { { company: booking.booker.company } }

  describe '#as_vehicles' do
    let(:correct_result) do
      [{
        value: 'Special',
        name: 'Special',
        price: 0,
        supports_driver_message: true,
        supports_flight_number: true
      }]
    end

    it 'returns correct result' do
      expect(service.as_vehicles).to eq correct_result
    end
  end

  describe '#can_execute?' do
    context 'allowed_services include :manual' do
      let(:allowed_services) { [:manual] }

      it { expect(service.can_execute?).to be_truthy }
    end

    context 'allowed_services doesnt include :manual' do
      let(:allowed_services) { [:ot] }

      it { expect(service.can_execute?).to be_falsey }
    end
  end
end
