require 'rails_helper'

RSpec.describe Manual::Modify, type: :service do
  let(:booking) { build(:booking, vehicle: create(:vehicle, :manual)) }

  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#normalized_response' do
    let(:correct_result) { {} }

    it 'returns correct result' do
      expect(service.normalized_response).to eq correct_result
    end
  end
end
