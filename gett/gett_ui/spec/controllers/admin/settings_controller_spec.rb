require 'rails_helper'

RSpec.describe Admin::SettingsController, type: :controller do
  let(:admin) { create :user, :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Settings do
    get :edit do
      stub_service(result: 'app data')

      expected_response(200 => 'app data')
    end

    post :update_vehicle_value do
      params { { vehicle_name: 'type', field: 'some-field', value: '123' } }
      expected_service_attributes { as_params(vehicle_name: 'type', field: 'some-field', value: '123') }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end

    post :update_deployment_notification do
      params { { deployment_notification: 'some notification' } }
      expected_service_attributes { { text: 'some notification' } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end

    post :update_ddi_phone do
      let(:service_class) { Admin::Ddis::UpdatePredefined }

      params { { ddi: { type: 'mega', phone: '123' } } }
      expected_service_attributes { as_params(type: 'mega', phone: '123') }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
