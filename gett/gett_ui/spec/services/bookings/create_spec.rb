require 'rails_helper'

RSpec.describe Bookings::Create, type: :service do
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0 }))
  end

  before { allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub) }

  let(:company) { create(:company, name: 'LEGO') }
  let(:admin)   { create(:admin, company: company) }

  subject(:service) { described_class.new(params: params) }

  service_context { { company: company, user: admin } }

  describe '#execute' do
    stub_channelling!
    before do
      allow(BookingsServiceJob).to receive(:perform_later)
        .with(instance_of(Booking), 'Bookings::CreateRequest')
      allow(Faye.bookings).to receive(:notify_create)
      allow(Alerts::FlightChecker).to receive_message_chain(:new, :execute)
      create(:vehicle, :gett, value: 'product')
    end

    context 'with invalid booking params' do
      let(:params) do
        {
          scheduled_type: 'now'
        }
      end

      it 'does not create new Booker with addresses' do
        expect{ service.execute }.not_to change(Booking, :count)
      end

      it 'does not create addresses' do
        expect{ service.execute }.not_to change(Address, :count)
      end

      context 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to include :vehicle }
      end
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
          scheduled_at: (90.minutes.from_now).to_s,
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
          as_directed: false
        }
      end

      it 'creates new Booking with addresses' do
        expect{ service.execute }.to change(Booking, :count).by(1)
          .and change(Address, :count).by(3)
      end

      it 'calculates travel distance' do
        service.execute
        expect(service.booking.travel_distance).to eq(20.0)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
        its(:booking) do
          is_expected.to have_attributes(
            booker_id: admin.id,
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

        context 'when member is reincarnated admin' do
          let(:company) { create(:company, phone_booking_fee: 5) }
          service_context { { reincarnated: true } }

          before { service.execute }

          its('booking.phone_booking') { is_expected.to be_truthy }
        end
      end

      context 'when source_type param is present' do
        before do
          params[:source_type] = source_type
          service.execute
        end

        context 'valid source type' do
          let(:source_type) { 'web' }

          its('booking.source_type') { is_expected.to eq source_type }
        end

        context 'invalid source type' do
          let(:source_type) { 'wrong' }

          its('booking.source_type') { is_expected.to eq 'api' }
        end
      end

      context 'when journey_type is present' do
        let(:params) { super().merge(journey_type: 'work_to_work') }

        before { service.execute }

        its('booking.journey_type') { is_expected.to eq('work_to_work') }
      end

      context 'when passenger_id is present' do
        let(:passenger) { create(:passenger, company: admin.company) }
        before { params[:passenger_id] = passenger.id }

        specify { expect(service.execute).to be_success }

        context 'calls Bookings::FutureBookingsNotifier' do
          it do
            expect(::Bookings::FutureBookingsNotifier).to receive_message_chain(:new, :execute)
            service.execute
          end

          it 'and notifies Faye' do
            expect(Faye).to receive(:notify)
            service.execute
          end
        end

        it 'associates passenger with booking' do
          expect(service.execute.booking.passenger).to eq passenger
        end
        it 'sets passenger_phone to booking' do
          expect(service.execute.booking.passenger_phone).to eq '+79998886655'
        end

        context 'when booking is created from back office by user who has front-office passenger account' do
          let(:other_company) { create(:company) }
          let(:customer_care) { create(:passenger, user_role_id: Role[:admin].id) }
          service_context { {company: company, user: customer_care, back_office: true} }

          it 'creates associates specified passenger with booking' do
            expect(service.execute.booking.passenger).to eq passenger
          end
        end

        context 'when any booking address is one of passenger addresses' do
          let(:address) { create(:address, params[:pickup_address]) }

          before { create(:passenger_address, passenger: passenger, address: address, type: 'home') }

          it 'saves passenger address type information with booking_address' do
            service.execute
            pickup_booking_address = service.booking.booking_addresses.find(&:pickup?)
            expect(pickup_booking_address.passenger_address_type).to eq('home')
          end
        end

        context 'when passenger is VIP' do
          let(:company)   { create(:company, special_requirement_pks: [sr.id]) }
          let(:passenger) { create(:passenger, company: company, vip: true) }
          let(:sr)        { create(:special_requirement, :ot, key: '112', label: 'vip') }

          before { service.execute }

          context 'when vehicle is not OT' do
            let(:vehicle) { create(:vehicle, :gett) }

            its('booking.special_requirements') { are_expected.to be_empty }
          end

          context 'when vehicle is OT' do
            let(:vehicle) { create(:vehicle, :one_transport) }

            its('booking.special_requirements') { are_expected.to eq(['112']) }
          end
        end
      end

      context 'when passenger name is present' do
        before { service.execute }

        context 'with name and surname' do
          let(:passenger_name) { 'Wayne Carter' }

          it 'assigns passenger name correctly' do
            expect(service.booking.passenger_first_name).to eq('Wayne')
            expect(service.booking.passenger_last_name).to eq('Carter')
          end
        end

        context 'with only name' do
          let(:passenger_name) { 'Wayne' }

          it 'assigns passenger name correctly' do
            expect(service.booking.passenger_first_name).to eq('Wayne')
            expect(service.booking.passenger_last_name).to be nil
          end
        end

        context 'with long name' do
          let(:passenger_name) { 'Wayne Carter Junior' }

          it 'assigns passenger name correctly' do
            expect(service.booking.passenger_first_name).to eq('Wayne')
            expect(service.booking.passenger_last_name).to eq('Carter Junior')
          end
        end
      end

      context 'when scheduled_at and scheduled_type are not present' do
        before do
          params[:scheduled_at] = nil
          service.execute
        end

        it { is_expected.not_to be_success }
      end

      context "when scheduled_at is not present and scheduled_type is 'now'" do
        before do
          params[:scheduled_at] = nil
          params[:scheduled_type] = 'now'
          service.execute
        end

        it { is_expected.to be_success }
        its(:booking) { is_expected.to be_asap }
        its('booking.scheduled_at') { is_expected.to be <= Time.current + 5.minutes }
      end

      context 'when option_identifier for Gett' do
        let(:vehicle) { create(:vehicle, :gett, value: 'product1') }

        it 'creates Gett booking' do
          expect { service.execute }.to change(Booking.gett, :count).by(1)
        end

        it 'performs CreateBookingRequestWorker with booking_id' do
          expect(CreateBookingRequestWorker).to receive(:perform_async)
          service.execute
        end

        context 'when vehicle did not found' do
          before do
            params[:vehicle_value] = 'other'
          end

          it 'returns correct error' do
            service.execute
            expect(service.booking.errors[:vehicle]).to include('is not present')
          end

          it 'does not perform CreateBookingRequestWorker' do
            expect(CreateBookingRequestWorker).not_to receive(:perform_async)
            service.execute
          end
        end
      end

      context 'when option_identifier for OT' do
        let(:vehicle) { create(:vehicle, :one_transport, value: 'Saloon_Standard') }

        before do
          params[:quote_id] = 'quote1'
        end

        it 'creates OT booking' do
          expect { service.execute }.to change(Booking.ot, :count).by(1)
        end

        it 'performs CreateBookingRequestWorker with booking_id' do
          expect(CreateBookingRequestWorker).to receive(:perform_async)
          service.execute
        end

        context 'when vehicle did not found' do
          before do
            params[:vehicle_value] = 'other'
          end

          it 'returns correct error' do
            service.execute
            expect(service.booking.errors[:vehicle]).to include('is not present')
          end

          it 'does not perform CreateBookingRequestWorker' do
            expect(CreateBookingRequestWorker).not_to receive(:perform_async)
            service.execute
          end
        end
      end

      context 'when option_identifier for Carey' do
        let(:vehicle) { create(:vehicle, :carey, value: 'Chauffeur') }
        let(:params) do
          super().merge(
            vehicle_code: 'ES03',
            service_type: 'Premium'
          )
        end

        it 'creates Carey booking' do
          expect{ service.execute }.to change(Booking.carey, :count).by(1)
        end

        it 'performs CreateBookingRequestWorker with booking_id' do
          expect(CreateBookingRequestWorker).to receive(:perform_async)
          service.execute
        end

        context 'when vehicle did not found' do
          before do
            params[:vehicle_value] = 'other'
          end

          it 'returns correct error' do
            service.execute
            expect(service.booking.errors[:vehicle]).to include('is not present')
          end

          it 'does not perform BookingsServiceJob with Bookings::CreateRequest' do
            expect(BookingsServiceJob).not_to receive(:perform_later)
            service.execute
          end
        end
      end

      context 'when booker references present' do
        let(:value)                        { '123' }
        let!(:validated_booking_reference) { create(:booking_reference, :validation_required, company: company) }
        let!(:reference_entry)             { create(:reference_entry, booking_reference: validated_booking_reference, value: value) }
        let!(:mandatory_booking_reference) { create(:booking_reference, :mandatory, company: company) }
        let!(:optional_booking_reference)  { create(:booking_reference, company: company) }

        context 'with valid params' do
          before do
            params[:booker_references] = [
              { booking_reference_id: validated_booking_reference.id, value: value },
              { booking_reference_id: mandatory_booking_reference.id, value: 'any value' },
              { booking_reference_id: optional_booking_reference.id, value: nil }
            ]

            expect(Bookings::ReferencesProcessor)
              .to receive(:new).with(params: params[:booker_references], booking_id: instance_of(Integer))
              .and_call_original
            expect(service).to receive(:validate_flight_number!)
          end

          it 'delegates booker_references creation to ReferencesProcessor service' do
            expect_any_instance_of(Bookings::ReferencesProcessor).to receive(:success?).and_call_original
            expect(service.execute).to be_success
            expect(service.booking.booker_references.count).to eq 2
            expect(service.booking.booker_references.first&.value).to eq value
            expect(service.booking.booker_references.second&.value).to eq 'any value'
          end
        end

        context 'with invalid params' do
          before do
            params[:booker_references] = [
              { booking_reference_id: optional_booking_reference.id, value: '' },
              { booking_reference_id: validated_booking_reference.id, value: 'val' }
            ]
            expect(service).not_to receive(:validate_flight_number!)
            service.execute
          end

          it { is_expected.not_to be_success }
          its(:errors) { is_expected.to include 'booker_references.1.value' }
        end
      end

      context 'when vehicle count present' do
        before do
          params[:vehicle_count] = vehicle_count
        end

        context 'and it is equel 1' do
          let(:vehicle_count) { '1' }
          it 'creates one booking' do
            expect { service.execute }.to change(Booking, :count).by(1)
          end
        end

        context 'and it more than 1' do
          let(:vehicle_count) { '3' }
          it 'creates multiple bookings' do
            expect { service.execute }.to change(Booking, :count).by(3)
          end
        end
      end

      describe 'faye notification' do
        context 'when enterprise company' do
          it 'sends notification' do
            expect(Faye.bookings).to receive(:notify_create).with(instance_of(Booking))
            service.execute
          end
        end

        context 'when affiliate company' do
          let(:company) { create :company, :affiliate }

          it 'it sends notification' do
            expect(Faye.bookings).to receive(:notify_create).with(instance_of(Booking))
            service.execute
          end
        end
      end

      context 'when flight number is present' do
        let(:flight_number_validator) { double(:flight_number_validator, errors: flight_errors) }
        let(:flight_number_validator_with_result) do
          double(:flight_number_validator_with_result, success?: flight_valid)
        end
        let(:flight_valid)  { true }
        let(:flight_errors) { {} }

        before do
          params[:flight] = 'B666'

          allow(Bookings::FlightValidator).to receive(:new).and_return(flight_number_validator)
          allow(flight_number_validator).to receive(:execute).and_return(flight_number_validator_with_result)
        end

        it 'validates flight number' do
          expect(Bookings::FlightValidator).to receive(:new).and_return(flight_number_validator)
          expect(flight_number_validator).to receive(:execute).and_return(flight_number_validator_with_result)

          service.execute
        end

        context 'invalid flight' do
          let(:flight_valid)  { false }
          let(:flight_errors) { {flight: ['invalid']} }

          it 'returns an error' do
            service.execute
            expect(service.errors.keys).to include(:flight)
          end
        end

        describe 'flight checker' do
          context 'when flight present' do
            it 'verifies flight' do
              expect(Alerts::FlightChecker).to receive_message_chain(:new, :execute)

              service.execute
            end
          end
        end
      end

      context 'when selected payment card as payment method' do
        let(:params) do
          super().merge(
            passenger_id: passenger.id,
            payment_method: 'personal_payment_card',
            payment_card_id: payment_card.id
          )
        end

        context 'when passenger is other member' do
          let(:passenger) { create(:passenger, company: admin.company, allow_personal_card_usage: false) }

          context 'when card is personal and allow_personal_card_usage is true' do
            let(:passenger)    { create(:passenger, company: admin.company, allow_personal_card_usage: true) }
            let(:payment_card) { create(:payment_card, :personal, passenger: passenger) }

            before { service.execute }

            it 'sets payment_method to personal_payment_card' do
              expect(service.booking.payment_method).to eq 'personal_payment_card'
            end

            it 'sets correct card_id' do
              expect(service.booking.payment_card_id).to eq payment_card.id
            end
          end

          context 'when card is personal and allow_personal_card_usage is false' do
            let(:payment_card) { create(:payment_card, :personal, passenger: passenger) }

            before { service.execute }

            it 'sets payment_method to personal_payment_card' do
              expect(service.booking.payment_method).to eq 'personal_payment_card'
            end

            it 'sets correct card_id' do
              expect(service.booking.payment_card_id).to eq nil
            end

            it('returns invalid booking') { expect(service.booking.valid?).to be_falsey }
          end

          context 'when card is business' do
            let(:payment_card) { create(:payment_card, :business, passenger: passenger) }

            before { service.execute }

            it 'sets payment_method to personal_payment_card' do
              expect(service.booking.payment_method).to eq 'personal_payment_card'
            end

            it 'sets correct card_id' do
              expect(service.booking.payment_card_id).to eq payment_card.id
            end
          end

          context 'when card is expired' do
            let(:payment_card) { create(:payment_card, :business, passenger: passenger, expiration_year: 2000) }

            before { service.execute }

            it 'sets payment_method to personal_payment_card' do
              expect(service.booking.payment_method).to eq 'personal_payment_card'
            end

            it 'sets card_id as nil' do
              expect(service.booking.payment_card_id).to eq nil
            end

            it 'returns invalid booking' do
              expect(service.booking).not_to be_valid
            end
          end
        end

        context 'when passenger is the same member' do
          service_context { { company: company, user: passenger } }

          let(:passenger)    { create(:passenger, company: admin.company) }
          let(:payment_card) { create(:payment_card, :personal, passenger: passenger) }

          before { service.execute }

          it 'sets payment_method to personal_payment_card' do
            expect(service.booking.payment_method).to eq 'personal_payment_card'
          end

          it 'sets correct card_id' do
            expect(service.booking.payment_card_id).to eq payment_card.id
          end
        end
      end

      context 'when vehicle_price is not present' do
        before do
          params[:vehicle_price] = nil
          service.execute
        end

        it { is_expected.to be_success }
        its('booking.fare_quote') { is_expected.to be 0 }
      end

      context 'when booking is recurring' do
        let(:scheduled_ats) { [1.day.from_now, 2.days.from_now] }
        let(:schedule)      { create(:booking_schedule, :custom, scheduled_ats: scheduled_ats) }

        before do
          params[:scheduled_type] = 'recurring'
          params[:schedule] = 'recurring_params'

          expect(Shared::BookingSchedules::Save)
            .to receive(:new).with(params: 'recurring_params', booking_params: params)
            .and_return(double(execute: double(success?: true, result: schedule)))

          service.execute
        end

        it { is_expected.to be_success }
        its('booking.recurring_next') { is_expected.to be true }
        its('booking.scheduled_at')   { is_expected.to be_within(1.second).of(scheduled_ats.first.to_datetime) }
        its('booking.schedule_id')    { is_expected.to eq schedule.id }
      end
    end
  end
end
