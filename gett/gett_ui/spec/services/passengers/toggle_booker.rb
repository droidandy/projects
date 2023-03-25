require 'rails_helper'

RSpec.describe Passengers::ToggleBooker, type: :service do
  describe '#execute' do
    let(:booker)    { create(:booker) }
    let(:passenger) { create(:passenger, booker_pks: booker_pks) }
    let(:service)   { described_class.new(passenger: passenger, booker: booker) }

    context 'passenger does not have this booker' do
      let(:booker_pks) { [] }

      it { expect{ service.execute }.to change{ passenger.booker_pks }.to([booker.id]) }
    end

    context 'passenger has this booker' do
      let(:booker_pks) { [booker.id] }

      it { expect{ service.execute }.to change{ passenger.booker_pks }.to([]) }
    end
  end
end
