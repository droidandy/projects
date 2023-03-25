require 'rails_helper'

describe CardReceiptMailer do
  describe '#card_receipt' do
    let(:company)   { create(:company) }
    let(:passenger) { create(:passenger, email: 'john@wayne.com') }
    let(:booking_reference) { create(:booking_reference, name: 'foo', company: company) }
    let(:payment_card)      { create(:payment_card, :personal, passenger: passenger) }
    let(:direction)         { Hashie::Mash.new(direction: 'direction_path') }

    let!(:booker_reference) do
      create(:booker_reference,
        booking: booking,
        booking_reference_name: booking_reference.name,
        value: 'bar'
      )
    end

    let(:booking) do
      create(:booking, :with_driver,
        passenger: passenger,
        service_id: 'service-id',
        payment_method: :personal_payment_card,
        travel_reason: create(:travel_reason, name: 'Beach'),
        payment_card_id: payment_card.id,
        pickup_address: pickup_address,
        destination_address: destination_address,
        stop_addresses: [stop_address],
        started_at: Time.zone.parse('06/02/2018 14:28'),
        ended_at: Time.zone.parse('06/02/2018 14:48')
      )
    end

    let(:pickup_address)      { create(:address, timezone: 'Europe/Kiev', line: 'Pickup') }
    let(:destination_address) { create(:address, line: 'Destination') }
    let(:stop_address)        { create(:address, line: 'Stop') }

    before do
      allow(GoogleApi).to receive(:fetch_direction).and_return(direction)

      create(:payment, booking: booking, amount_cents: 2010, status: 'captured')
      create(:booking_charges, booking_fee: 113, handling_fee: 399, tips: 923, booking: booking)
    end

    subject { described_class.card_receipt(booking) }

    its(:subject)       { is_expected.to eq 'Your receipt for service-id order' }
    its(:to)            { is_expected.to eq ['john@wayne.com'] }
    its(:from)          { is_expected.to eq ['donotreply@gett.com'] }
    its(:content_type)  { is_expected.to eq 'text/html; charset=UTF-8' }
    its(:mime_version)  { is_expected.to eq '1.0' }
    its('body.encoded') { is_expected.to include '20.1' }
    its('body.encoded') { is_expected.to include 'Personal' }
    its('body.encoded') { is_expected.to include payment_card.last_4 }
    its('body.encoded') { is_expected.to include passenger.first_name }
    its('body.encoded') { is_expected.to include booking.pickup_address.line }
    its('body.encoded') { is_expected.to include booking.destination_address.line }
    its('body.encoded') { is_expected.to include booking.stop_addresses.first.line }
    its('body.encoded') { is_expected.to include '16:28, 06 February 2018' } # started at
    its('body.encoded') { is_expected.to include '16:48, 06 February 2018' } # ended at
    its('body.encoded') { is_expected.to include '00:20:00' } # ride duration
    its('body.encoded') { is_expected.to include booking.driver.name }
    its('body.encoded') { is_expected.to include "#{booking.travel_distance} miles" }
    its('body.encoded') { is_expected.to include 'Beach' }
    its('body.encoded') { is_expected.to include 'foo' }
    its('body.encoded') { is_expected.to include 'bar' }
    its('body.encoded') { is_expected.to include '00:00:00' }
    its('body.encoded') { is_expected.to include '5.12' } # Fee
    its('body.encoded') { is_expected.to include '9.23' } # Tips

    context 'waiting time present' do
      before { create(:booking_charges, paid_waiting_time: seconds, booking: booking) }

      context 'waiting time string contains minutes and seconds' do
        let(:seconds) { 910 }

        its('body.encoded') { is_expected.to include '00:15:00' }
      end

      context 'waiting time string contains hours, minutes and seconds' do
        let(:seconds) { 4220 }

        its('body.encoded') { is_expected.to include '01:10:00' }
      end
    end

    context 'without a driver' do
      let(:booking) { create(:booking) }

      it "doesn't raise an error" do
        expect{ described_class.card_receipt(booking).body }.not_to raise_error
      end
    end
  end
end
