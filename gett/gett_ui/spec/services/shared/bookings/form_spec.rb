require 'rails_helper'

RSpec.describe Shared::Bookings::Form, type: :service do
  let(:company)   { create(:company, default_payment_type: 'cash') }
  let(:passenger) { create(:passenger, company: company, first_name: 'Adam') }
  let(:address)   { create(:address) }
  let(:booker)    { create(:booker, company: company, passenger_pks: [passenger.id], first_name: 'Zorg') }
  let(:booking)   { create(:booking, :scheduled, booker: booker, stop_addresses: [address]) }

  subject(:service) { Shared::Bookings::Form.new(booking: booking) }

  service_context { { company: company } }

  before do
    allow(service).to receive(:member).and_return(booker)
    allow(service).to receive(:company).and_return(company)
  end

  describe 'execution' do
    before { service.execute }

    it { is_expected.to be_success }
  end

  describe 'result' do
    subject(:result) { service.execute.result.with_indifferent_access }

    it { is_expected.to include(:booking) }

    it 'has all necessary fields' do
      expect(result[:booking].keys).to match_array(%w(
        id
        message
        flight
        international_flag
        status
        passenger_id
        booker_id
        scheduled_at
        travel_reason_id
        payment_card_id
        vehicle_vendor_id
        special_requirements
        service_type
        message_to_driver
        passenger_name
        passenger_phone
        payment_type
        payment_method
        pickup_address
        destination_address
        stops
        scheduled_type
        vehicle_value
        vehicle_name
        schedule
      ))
    end

    describe 'addresses serialization' do
      it 'serializes pickup and destination addresses properly' do
        # pickup or destination address may be passenger's "Home" address, and it is important to have
        # id in response to be able to restore sanitized address line
        expect(result.dig(:booking, :pickup_address))
          .to include(:id, :line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone)

        expect(result.dig(:booking, :destination_address))
          .to include(:id, :line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone)
      end

      it 'serializes stop points properly' do
        # stop points may never be created with "Home" address line (address is always explicitly
        # selected or entered), so we don't care about presence of :id during editing
        expect(result.dig(:booking, :stops, 0, :address))
          .to include(:line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone)

        expect(result.dig(:booking, :stops, 0, :stop)).to eq('info')
      end
    end

    describe 'booking payment_type' do
      subject(:payment_type) { result.dig(:booking, :payment_type) }

      context 'when booking was paid with payment card' do
        let(:card) { create(:payment_card, :personal, passenger: passenger) }
        let(:booking) do
          create(:booking, :scheduled,
            booker: booker,
            passenger: passenger,
            payment_method: :personal_payment_card,
            payment_card: card
          )
        end

        it { is_expected.to eq("personal_payment_card:#{card.id}") }

        context 'when card was disabled' do
          let(:card) { create(:payment_card, :personal, :disabled, passenger: passenger) }

          it { is_expected.to eq('cash') }
        end

        context 'when booking was paid with account' do
          let(:company) { create(:company, payment_types: %w(account cash), default_payment_type: 'passenger_payment_card') }
          let(:passenger) { create(:passenger, company: company) }
          let(:booking) do
            create(:booking, :scheduled,
              booker: booker,
              passenger: passenger,
              payment_method: :account
            )
          end

          it { is_expected.to eq('account') }

          context 'when account was disabled from company payment options' do
            let(:company) { create(:company, payment_types: ['passenger_payment_card', 'cash'], default_payment_type: 'cash') }

            it { is_expected.to eq('cash') }
          end
        end
      end
    end
  end
end
