require 'rails_helper'

RSpec.describe PassengersController, type: :controller do
  let(:company)    { create :company }
  let(:admin)      { create :admin, company: company }
  let!(:passenger) { create :passenger, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Passengers do
    get :index do
      stub_service(result: 'passengers list')

      expected_response(200 => 'passengers list')
    end

    get :stats do
      params { { id: passenger.id } }

      expected_service_attributes { { passenger: passenger } }
      stub_service(result: 'passenger stats')

      expected_response(200 => 'passenger stats')
    end

    get :log do
      let(:service_class) { Passengers::AuditLog }

      params { { id: passenger.id } }

      expected_service_attributes { { passenger: passenger } }

      stub_service(result: 'passenger change log')

      expected_response(200 => 'passenger change log')
    end

    get :new do
      let(:service_class) { Passengers::Form }

      stub_service(result: 'passengers form data')

      expected_response(200 => 'passengers form data')
    end

    post :create do
      params { { passenger: {first_name: 'foo'} } }

      expected_service_attributes { { params: as_params(first_name: 'foo') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :show do
      params { { id: passenger.id } }

      expected_service_attributes { { passenger: passenger } }

      stub_service(result: 'passenger data')

      expected_response(200 => 'passenger data')
    end

    get :edit do
      let(:service_class) { Passengers::Form }

      params { { id: passenger.id } }

      expected_service_attributes { { passenger: passenger } }

      stub_service(result: 'passengers form data')

      expected_response(200 => 'passengers form data')
    end

    put :update do
      params { { id: passenger.id, passenger: {first_name: 'foo'} } }

      expected_service_attributes { { passenger: passenger, params: as_params(first_name: 'foo') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :export do
      stub_service(result: 'bookings data')

      expected_response(200 => 'bookings data')
    end

    post :import do
      let(:service_class) { Passengers::ManualImport }

      params { { import: {file: :data, onboarding: true} } }

      expected_service_attributes { { params: as_params(file: 'data', onboarding: 'true') } }

      expected_response(200)
    end

    put :toggle_booker do
      params { { id: passenger.id } }

      expected_service_attributes { { passenger: passenger, booker: admin } }

      on_success do
        stub_service(show_result: 'passenger values')
        expected_response(200 => 'passenger values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    describe '#calculate_excess' do
      let(:home_address) { create(:address) }
      let(:work_address) { create(:address) }

      let(:params) do
        {
          home_address: {
            lat: home_address.lat.to_s,
            lng: home_address.lng.to_s,
            line: home_address.line.to_s,
            postal_code: home_address.postal_code.to_s,
            city: home_address.city.to_s,
            country_code: home_address.country_code.to_s
          },
          work_address: {
            lat: work_address.lat.to_s,
            lng: work_address.lng.to_s,
            line: work_address.line.to_s,
            postal_code: work_address.postal_code.to_s,
            city: work_address.city.to_s,
            country_code: work_address.country_code.to_s
          }
        }
      end

      it 'calls Passengers::CalculateExcess with correct attrs' do
        expect(Passengers::CalculateExcess).to receive(:new)
          .with(params)
          .and_return(double(execute: double(success?: true, result: {})))

        post(:calculate_excess, params: params)
      end
    end
  end

  describe 'home address params' do
    let!(:address) { create(:address) }

    it 'restores home address params' do
      expect(Passengers::Update).to receive(:new)
        .with(
          passenger: passenger,
          params: as_params(
            home_address: address.values.slice(:lat, :lng, :line, :postal_code, :city, :country_code, :timezone).merge(id: address.id.to_s)
          )
        )
        .and_return(double(execute: double(success?: true)))

      put(:update, params: {id: passenger.id, passenger: {home_address: {id: address.id}}})
    end
  end
end
