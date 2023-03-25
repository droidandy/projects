require 'rails_helper'

RSpec.describe Incomings::GetEController, type: :controller do
  it_behaves_like 'service controller' do
    before { request.headers['Authorization'] = 'AccessToken' }

    post :create do
      params { { foo: 'bar', event: {name: event} } }

      context 'TRIP_DRIVER_UPDATE event' do
        let(:event)         { 'TRIP_DRIVER_UPDATE' }
        let(:service_class) { Incomings::GetE::DriverUpdateHandler }

        expected_service_attributes { { payload: {foo: 'bar', event: {name: event}} } }

        expected_response(200)
      end

      context 'TRIP_PRICE_UPDATE event' do
        let(:event)         { 'TRIP_PRICE_UPDATE' }
        let(:service_class) { Incomings::GetE::PriceUpdateHandler }

        expected_service_attributes { { payload: {foo: 'bar', event: {name: event}} } }

        expected_response(200)
      end

      context 'TRIP_STATUS_UPDATE event' do
        let(:event)         { 'TRIP_STATUS_UPDATE' }
        let(:service_class) { Incomings::GetE::TripStatusUpdateHandler }

        expected_service_attributes { { payload: {foo: 'bar', event: {name: event}} } }

        expected_response(200)
      end
    end
  end
end
