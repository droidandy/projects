require 'rails_helper'

RSpec.describe Incomings::GetE::PriceUpdateHandler, type: :service do
  let(:service) { Incomings::GetE::PriceUpdateHandler.new(payload: payload) }
  let(:payload) do
    {
      data: {
        Unid: 'Unid',
        Pricing: {
          Price: {
            Amount: '5.99'
          }
        }
      }
    }.with_indifferent_access
  end
  let(:incoming) { Incoming.last }

  context 'when valid' do
    let(:company) { create(:company) }
    let!(:booking) { create(:booking, :completed, company: company, service_id: 'Unid') }

    it 'calls updates booking and runs BookingsChargesUpdater' do
      expect(BookingsChargesUpdater).to receive(:perform_async).with(booking.id)
      expect{ service.execute }.to change(Incoming, :count).by(1)
        .and change{ booking.reload.fare_quote }.from(0).to(599)
      expect(service).to be_success
      expect(incoming.api_errors).to be_blank
    end

    context 'with fx rate increase' do
      let(:company) { create(:company, system_fx_rate_increase_percentage: 50) }

      before do
        allow(booking).to receive(:international?).and_return(international)
        allow(service).to receive(:booking).and_return(booking)
      end

      context 'when it applicable for international booking' do
        let(:international) { true }

        it 'change fare_quote for booking according to fx rate increase' do
          expect{ service.execute }.to change{ booking.reload.fare_quote }.from(0).to(899)
        end
      end

      context 'when it not applicable for local booking' do
        let(:international) { false }

        it 'leave fare_quote without changes' do
          expect{ service.execute }.to change{ booking.reload.fare_quote }.from(0).to(599)
        end
      end
    end
  end

  context 'when booking does not exist' do
    it 'creates Incoming record with errors' do
      expect{ service.execute }.to change(Incoming, :count).by(1)
      expect(service).to be_success
      expect(incoming.api_errors).to be_present
    end
  end

  context 'when booking is not completed' do
    let!(:booking) { create(:booking, service_id: 'Unid') }

    it 'calls doesnt update booking and doesnt run BookingsChargesUpdater' do
      expect(BookingsChargesUpdater).to_not receive(:perform_async).with(booking.id)
      expect{ service.execute }.to change(Incoming, :count)
      expect{ service.execute }.to_not change{ booking.reload.fare_quote }

      expect(service).to be_success

      expect(service.errors).to eq(booking: ['Booking is not completed'])
    end
  end
end
