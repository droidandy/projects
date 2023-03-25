require 'rails_helper'

RSpec.describe Bookers::TogglePassenger, type: :service do
  describe '#execute' do
    let(:passenger) { create(:passenger) }
    let(:booker)  { create(:booker, passenger_pks: passenger_pks) }
    let(:service) { described_class.new(booker: booker, passenger: passenger) }

    context 'booker does not have this passenger' do
      let(:passenger_pks) { [] }

      it { expect{ service.execute }.to change{ booker.passenger_pks }.to([passenger.id]) }
    end

    context 'booker has this passenger' do
      let(:passenger_pks) { [passenger.id] }

      it { expect{ service.execute }.to change{ booker.passenger_pks }.to([]) }
    end
  end
end
