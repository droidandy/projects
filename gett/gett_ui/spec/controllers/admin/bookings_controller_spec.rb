require 'rails_helper'

RSpec.describe Admin::BookingsController, type: :controller do
  let(:admin) { create(:user, :admin) }
  let(:booker) { create(:member) }
  let(:booking) { create(:booking, booker: booker) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Bookings do
    get :index do
      let(:sample_params) do
        {
          page: '1',
          order: 'name',
          reverse: 'false',
          search: '',
          final: 'true',
          not_final: 'false',
          company_type: 'affiliate',
          with_alerts: 'false',
          from: 'timestamp',
          to: 'other timestamp',
          payment_method: ['cash'],
          status: ['completed'],
          ids: ['1'],
          vehicle_types: ['exec']
        }
      end

      context 'when fetching bookings list' do
        params { sample_params }

        expected_service_attributes { { query: as_params(sample_params), invoice_id: nil } }

        stub_service(result: 'bookings list')

        expected_response(200 => 'bookings list')
      end

      context 'when fetching bookings list for credit note' do
        params { sample_params.merge(invoice_id: '1') }

        expected_service_attributes { { query: as_params(sample_params), invoice_id: '1' } }

        stub_service(result: 'bookings list')

        expected_response(200 => 'bookings list')
      end
    end

    get :show do
      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'booking show data')

      expected_response(200 => 'booking show data')
    end

    get :log do
      let(:service_class) { Admin::Bookings::AuditLog }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'bookings change log')

      expected_response(200 => 'bookings change log')
    end

    get :new do
      let(:service_class) { Admin::Bookings::Form }

      stub_service(result: 'booking form data')

      expected_response(200 => 'booking form data')
    end

    post :create do
      let(:service_class) { Admin::Bookings::Create }

      params do
        {
          booking: {
            vehicle_value: "vehicle_value",
            quote_id: 'quote_id',
            message: 'Some message',
            passenger_name: 'Petr Ivanov',
            passenger_phone: '+79998886655',
            travel_reason_id: 'travel_reason_id',
            scheduled_at: '2017-05-11T19:42:06+00:00',
            vehicle_vendor_id: '1',
            vehicle_count: '2',
            pickup_address: { postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup' },
            destination_address: { postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown' },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point' }}],
            booker_id: booker.id
          },
          company_id: booker.company.id
        }
      end

      expected_service_attributes do
        {
          params: as_params(
            vehicle_value: "vehicle_value",
            quote_id: 'quote_id',
            message: 'Some message',
            passenger_name: 'Petr Ivanov',
            passenger_phone: '+79998886655',
            travel_reason_id: 'travel_reason_id',
            scheduled_at: '2017-05-11T19:42:06+00:00',
            vehicle_vendor_id: '1',
            vehicle_count: '2',
            pickup_address: { postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup' },
            destination_address: { postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown' },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point' }}],
            booker_id: booker.id.to_s
          )
        }
      end

      on_success do
        stub_service(show_result: 'booking')
        expected_response(200 => 'booking')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :edit do
      let(:service_class) { Admin::Bookings::Form }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'booking form data')

      expected_response(200 => 'booking form data')
    end

    put :update do
      let(:service_class) { Admin::Bookings::Modify }

      params { { id: booking.id, booking: {vehicle_value: 'value'} } }

      expected_service_attributes { { booking: booking, params: as_params(vehicle_value: 'value') } }

      on_success do
        stub_service(show_result: 'booking')
        expected_response(200 => 'booking')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :repeat do
      let(:service_class) { Admin::Bookings::Form }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking, repeat: true } }

      on_success do
        stub_service(result: 'booking form data')
        expected_response(200 => 'booking form data')
      end

      on_failure do
        expected_response(404)
      end
    end

    put :cancel do
      let(:service_class) { Admin::Bookings::Cancel }

      params { { id: booking.id, cancellation_fee: 'false' } }

      expected_service_attributes { { booking: booking, params: as_params(cancellation_fee: 'false') } }
      stub_service{ { booking_data: 'booking show data' } }

      on_success do
        expected_response(200 => 'booking show data')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :resend_order do
      let(:service_class) { Admin::Bookings::ResendOrder }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      on_success do
        stub_service(result: 'success')
        expected_response(200 => 'success')
      end

      on_failure do
        expected_response(404)
      end
    end

    get :timeline do
      let(:service_class) { ::Bookings::ExportTimeline }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'image data')
      expected_response(200 => 'image data')
    end

    post :form_details do
      let(:service_class) { ::Shared::Bookings::FormDetails }

      params do
        {
          id: booking.id,
          request_vehicles: true,
          request_scheduled_ats: true,
          request_payment_types: true,
          preserve_payment_type: true,
          preserve_scheduled_ats: true,
          booking: {
            vehicle_value: "vehicle_value",
            quote_id: 'quote_id',
            message: 'Some message',
            passenger_name: 'Petr Ivanov',
            passenger_phone: '+79998886655',
            travel_reason_id: 'travel_reason_id',
            scheduled_at: '2017-05-11T19:42:06+00:00',
            vehicle_count: '2',
            as_directed: true,
            pickup_address: {
              postal_code: 'NW11 9UA',
              lat: '51.5766877',
              lng: '-0.2156368',
              line: 'Pickup',
              city: 'London'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: 'Setdown',
              city: 'Cambridge'
            },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point' }}]
          }
        }
      end

      expected_service_attributes do
        {
          data_params: as_params(
            request_vehicles: 'true',
            request_scheduled_ats: 'true',
            request_payment_types: 'true',
            preserve_payment_type: 'true',
            preserve_scheduled_ats: 'true'
          ),
          booking_params: as_params(
            vehicle_value: "vehicle_value",
            quote_id: 'quote_id',
            message: 'Some message',
            passenger_name: 'Petr Ivanov',
            passenger_phone: '+79998886655',
            travel_reason_id: 'travel_reason_id',
            scheduled_at: '2017-05-11T19:42:06+00:00',
            vehicle_count: '2',
            as_directed: 'true',
            pickup_address: {
              postal_code: 'NW11 9UA',
              lat: '51.5766877',
              lng: '-0.2156368',
              line: 'Pickup',
              city: 'London'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: 'Setdown',
              city: 'Cambridge'
            },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point' }}]
          ),
          company: booking.company,
          allow_personal_cards: true,
          with_manual: true,
          include_vehicle_vendor_options: true
        }
      end

      stub_service(result: 'form details')
      expected_response(200 => 'form details')
    end

    get :references do
      let(:service_class) { Bookings::References }

      params { { company_id: booking.company.id } }

      stub_service(result: 'booking references')

      expected_response(200 => 'booking references')
    end

    post :validate_references do
      let(:service_class) { Bookings::ReferencesProcessor }

      params { { company_id: booking.company.id, booker_references: ['booking_reference_id' => '1', 'value' => 'foo'] } }

      expected_service_attributes { { params: [as_params(booking_reference_id: '1', value: 'foo')], validate_value: true } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :toggle_critical_flag do
      let(:service_class) { Admin::Bookings::ToggleCriticalFlag }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      on_success do
        stub_service(show_result: 'success')
        expected_response(200 => 'success')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
