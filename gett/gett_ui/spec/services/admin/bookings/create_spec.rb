require 'rails_helper'

RSpec.describe Admin::Bookings::Create, type: :service do
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0 }))
  end

  before { allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub) }

  let(:company) { create(:company, name: 'LEGO') }
  let(:admin)   { create(:admin, company: company) }
  let(:booker)  { create(:booker, company: company) }
  let!(:reference1) { create(:booking_reference, company: company, priority: 1) }
  let!(:reference2) { create(:booking_reference, :validation_required, company: company, priority: 2) }

  subject(:service) { described_class.new(params: params) }

  service_context { { company: company, user: admin } }

  describe '#execute' do
    before do
      allow(BookingsServiceJob).to receive(:perform_later)
        .with(instance_of(Booking), 'Bookings::CreateRequest')
      allow(Faye.bookings).to receive(:notify_create)
      create(:vehicle, :gett, value: 'product')
    end

    context 'with valid params' do
      let(:vehicle) { create(:vehicle, :gett) }
      let(:travel_reason) { create(:travel_reason, company: admin.company) }
      let(:passenger_name) { nil }
      let(:params) do
        {
          vehicle_value: vehicle.value,
          message: 'Some message',
          passenger_name: passenger_name,
          passenger_phone: '+79998886655',
          international_flag: true,
          travel_reason_id: travel_reason.id,
          scheduled_at: (Time.current + 31.minutes).to_s,
          payment_method: 'account',
          pickup_address: { postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup', country_code: 'GB', city: 'London' },
          destination_address: { postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown', country_code: 'GB', city: 'London' },
          stops: [
            {
              name: 'Bob',
              phone: '777888666555',
              address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point', country_code: 'GB', city: 'London' }
            }
          ],
          vehicle_price: 1000,
          booker_id: booker.id
        }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
        its(:booking) do
          is_expected.to have_attributes(
            message: 'Some message',
            passenger_phone: '+79998886655',
            international_flag: true,
            passenger_id: nil,
            source_type: 'api',
            asap: false
          )
        end
        its('booking.vehicle') { is_expected.to be_present }
        its('booking.pickup_address') { is_expected.to be_present }
        its('booking.destination_address') { is_expected.to be_present }
        its('booking.stop_addresses') { is_expected.to be_present }
        its('booking.travel_reason') { is_expected.to be_present }
        its('booking.scheduled_at') { is_expected.to be_present }
        its('booking.phone_booking') { is_expected.to be_falsey }
      end
    end
  end
end
