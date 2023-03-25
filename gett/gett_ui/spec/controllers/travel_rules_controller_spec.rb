require 'rails_helper'

RSpec.describe TravelRulesController, type: :controller do
  let(:company)      { create :company }
  let(:admin)        { create :admin, company: company }
  let!(:travel_rule) { create :travel_rule, company: company }
  let(:vehicle)      { create :vehicle, :gett }

  before { sign_in admin }

  it_behaves_like 'service controller', module: TravelRules do
    get :index do
      stub_service(result: 'travel rules list')

      expected_response(200 => 'travel rules list')
    end

    post :create do
      let(:travel_rule_params) do
        {
          name: 'New rule name',
          member_pks: [admin.id.to_s],
          vehicle_pks: [vehicle.id.to_s]
        }
      end
      params { { travel_rule: travel_rule_params } }

      expected_service_attributes { { params: as_params(travel_rule_params) } }

      on_success do
        stub_service(result: 'travel rule values')
        expected_response(200 => 'travel rule values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      let(:travel_rule_params) do
        {
          name: 'New rule name',
          member_pks: [admin.id.to_s],
          vehicle_pks: [vehicle.id.to_s]
        }
      end
      params { { id: travel_rule.id, travel_rule: travel_rule_params } }

      expected_service_attributes { { travel_rule: travel_rule, params: as_params(travel_rule_params) } }

      on_success do
        stub_service(result: 'travel rule values')
        expected_response(200 => 'travel rule values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => { errors: 'errors' }.to_json)
      end
    end

    get :log do
      let(:service_class) { TravelRules::AuditLog }

      params { { id: travel_rule.id } }

      expected_service_attributes { { travel_rule: travel_rule } }

      stub_service(result: 'travel rule change log')

      expected_response(200 => 'travel rule change log')
    end

    get :form do
      stub_service(result: 'travel rule values')

      expected_response(200 => 'travel rule values')
    end

    delete :destroy do
      params { { id: travel_rule.id } }

      expected_service_attributes { { travel_rule: travel_rule } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update_priorities do
      let(:another_rule) { create :travel_rule, company: company }
      let(:service_params) { [travel_rule.id.to_s, another_rule.id.to_s] }
      params { { priorities: service_params } }

      expected_service_attributes { { ordered_ids: service_params } }

      on_success do
        stub_service(result: 'priorities changed')
        expected_response(200 => '')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => '{}')
      end
    end
  end
end
