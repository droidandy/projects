require 'rails_helper'

RSpec.describe BookingsController, type: :controller do
  let(:company) { create(:company) }
  let(:admin) { create(:admin, company: company) }
  let(:booking) { create(:booking, booker: admin) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Bookings do
    get :index do
      let(:sample_params) do
        {
          page: '1',
          order: 'name',
          reverse: 'false',
          search: '',
          final: 'true',
          not_final: 'false',
          from: 'timestamp',
          to: 'other timestamp',
          status: ['completed'],
          ids: ['1'],
          vehicle_types: ['exec'],
          include_passenger_ids: ['1', '2'],
          exclude_passenger_ids: ['2', '3']
        }
      end

      params { sample_params }

      expected_service_attributes { { query: as_params(sample_params) } }

      stub_service(result: 'bookings list')

      expected_response(200 => 'bookings list')
    end

    get :new do
      let(:service_class) { Bookings::Form }

      stub_service(result: 'booking form data')

      expected_response(200 => 'booking form data')
    end

    get :show do
      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'booking show data')

      expected_response(200 => 'booking show data')
    end

    get :references do
      stub_service(result: 'booking references')

      expected_response(200 => 'booking references')
    end

    post :validate_references do
      let(:service_class) { Bookings::ReferencesProcessor }

      params { { booker_references: ['booking_reference_id' => '1', 'value' => 'foo'] } }

      expected_service_attributes { { params: [as_params(booking_reference_id: '1', value: 'foo')], validate_value: true } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    post :form_details do
      params do
        {
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
              line: 'Pickup'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: 'Setdown'
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
              line: 'Pickup'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: 'Setdown'
            },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point' }}]
          )
        }
      end

      stub_service(result: 'form details')
      expected_response(200 => 'form details')
    end

    post :create do
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
            source_type: 'web'
          }
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
            source_type: 'web'
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
      let(:service_class) { Bookings::Form }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'booking form data')

      expected_response(200 => 'booking form data')
    end

    put :update do
      let(:service_class) { Bookings::Modify }

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

    put :cancel do
      params { { id: booking.id } }

      expected_service_attributes { { booking: booking, params: as_params({}) } }
      stub_service{ { booking_data: 'booking show data' } }

      on_success do
        expected_response(200 => 'booking show data')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :rate do
      params { { id: booking.id, rating: 5, rating_reasons: ['some_reason'] } }

      expected_service_attributes { { booking: booking, params: as_params(rating: '5', rating_reasons: ['some_reason']) } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end

    get :repeat do
      let(:service_class) { Bookings::Repeat }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      on_success do
        stub_service(result: 'booking form data')
        expected_response(200 => 'booking form data')
      end

      on_failure do
        expected_response(404)
      end
    end

    get :export do
      stub_service(result: 'bookings data')

      expected_response(200 => 'bookings data')
    end

    get :products do
      let(:service_class) { Gett::Products }

      params { { latitude: '51.5766877', longitude: '-0.2156368' } }

      expected_service_attributes do
        {
          address: as_params(latitude: '51.5766877', longitude: '-0.2156368')
        }
      end

      on_success do
        stub_service(normalized_response: 'response')
        expected_response(200 => 'response')
      end

      on_failure do
        expected_response(404)
      end
    end

    put :cancellation_reason do
      let(:service_class) { Bookings::CancellationReason }

      params { { id: booking.id, cancellation_reason: 'reason' } }

      expected_service_attributes { { booking: booking, reason: 'reason' } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end

  describe 'pickup and destination addresses address params' do
    let(:address) { create(:address) }

    it 'restores address params' do
      restored_address_params = address.as_json(only: %i[lat lng line postal_code city country_code timezone]).merge(id: address.id.to_s)

      expect(Bookings::Create).to receive(:new)
        .with(
          params: as_params(
            pickup_address: restored_address_params,
            destination_address: restored_address_params
          )
        )
        .and_return(double(execute: double(success?: true), show_result: true))

      post(:create,
        params: {
          booking: {
            pickup_address: {id: address.id},
            destination_address: {id: address.id}
          }
        }
      )
    end
  end
end
