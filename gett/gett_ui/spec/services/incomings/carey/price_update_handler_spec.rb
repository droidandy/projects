require 'rails_helper'

RSpec.describe Incomings::Carey::PriceUpdateHandler, type: :service do
  before do
    allow(Currencies::Converter).to receive_message_chain(:new, :execute, :result).and_return(500)
  end

  let(:payload) do
    {
      "res_num" => reservation_id,
      "amount" => "123",
      "currencyCode" => "USD"
    }.with_indifferent_access
  end

  let(:reservation_id) { "WA11111111-1" }

  subject(:service) { described_class.new(payload: payload) }

  describe '#execute!' do
    before do
      allow(Airbrake).to receive(:notify)
      allow(Faye.bookings).to receive(:notify_update)
    end

    context 'when booking was not found' do
      it 'fails and notifies Airbrake' do
        expect{ service.execute }.not_to change(Incoming, :count)
        expect(service).not_to be_success
        expect(Airbrake).to have_received(:notify).with(an_instance_of(Incomings::Carey::WebhookFailedError))
      end
    end

    context 'when booking was found' do
      let(:company) { create(:company) }
      let!(:booking) { create(:booking, :carey, :completed, company: company, service_id: reservation_id) }

      it 'executes successfully and creates Incoming record' do
        expect{ service.execute }.to change(Incoming, :count).by(1)
        expect(service).to be_success
      end

      it 'updates booking fare quote' do
        service.execute
        expect(booking.reload).to have_attributes(fare_quote: 500)
      end

      it 'calls charging service' do
        charging_stub = double
        expect(charging_stub).to receive(:execute)
        expect(Bookings::ChargesUpdaters::Carey).to receive(:new)
          .with(booking: booking).and_return(charging_stub)

        service.execute
      end

      context 'with fx rate increase' do
        let(:company) { create(:company, system_fx_rate_increase_percentage: 50) }

        before do
          allow(booking).to receive(:international?).and_return(international)
          allow(service).to receive(:booking).and_return(booking)
          service.execute
          booking.reload
        end

        context 'when it applicable for international booking' do
          let(:international) { true }

          it 'change fare_quote for booking according to fx rate increase' do
            expect(booking).to have_attributes(fare_quote: 750)
          end
        end

        context 'when it not applicable for local booking' do
          let(:international) { false }

          it 'leave fare_quote without changes' do
            expect(booking).to have_attributes(fare_quote: 500)
          end
        end
      end
    end
  end

  describe '#incoming' do
    let!(:booking) { create(:booking, :carey, :completed, service_id: reservation_id) }

    subject(:incoming) { service.send(:incoming) }

    it 'should build Incoming instance' do
      expect(incoming).to be_an_instance_of(Incoming)
      expect(incoming).to have_attributes(service_type: 'carey', payload: payload)
    end
  end
end
