require 'rails_helper'

RSpec.describe Mobile::V1::BookingsController, type: :controller do
  let(:company) { create(:company) }
  let(:admin) { create(:admin, company: company) }
  let(:booking) { create(:booking, booker: admin) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Mobile::V1::Bookings do
    post :form_details do
      let(:service_class) { Mobile::V1::Bookings::FormDetails }

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
              line: 'Pickup',
              street_name: 'Bakery',
              street_number: '38D',
              point_of_interest: 'Hotel'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: 'Setdown',
              street_name: 'Red Lion',
              street_number: '38D',
              point_of_interest: 'Hotel',
              airport: 'LTN'
            },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', street_name: 'Cake', street_number: '38D', point_of_interest: 'Hotel', line: 'Stop point' }}]
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
              street_name: 'Bakery',
              street_number: '38D',
              point_of_interest: 'Hotel'
            },
            destination_address: {
              postal_code: 'HA8 6EY',
              lat: '51.6069082',
              lng: '-0.2816665',
              line: 'Setdown',
              street_name: 'Red Lion',
              street_number: '38D',
              point_of_interest: 'Hotel',
              airport_iata: 'LTN'
            },
            stops: [{ name: 'Petr', phone: '+79998886655', address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point', street_name: 'Cake', street_number: '38D', point_of_interest: 'Hotel' }}]
          )
        }
      end

      stub_service(result: 'form details')
      expected_response(200 => 'form details')
    end

    get :repeat do
      let(:service_class) { ::Bookings::Repeat }

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

    get :reverse do
      let(:service_class) { ::Bookings::Reverse }

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
  end
end
