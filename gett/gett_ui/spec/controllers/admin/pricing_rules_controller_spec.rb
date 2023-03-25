require 'rails_helper'

RSpec.describe Admin::PricingRulesController, type: :controller do
  let(:admin) { create(:user, :superadmin) }
  let!(:pricing_rule) { create(:pricing_rule, :area) }

  before { sign_in(admin) }

  it_behaves_like 'service controller', module: Admin::PricingRules do
    get :index do
      params { { company_id: '1' } }

      expected_service_attributes { { company_id: '1' } }

      stub_service(result: 'pricing rule list')

      expected_response(200 => 'pricing rule list')
    end

    post :create do
      let(:pricing_rule_params) do
        {
          name: 'Rule 1',
          company_id: '1',
          rule_type: 'point_to_point',
          price_type: 'fixed'
        }
      end

      params { { rule: pricing_rule_params } }

      expected_service_attributes { { params: as_params(pricing_rule_params) } }

      on_success do
        stub_service(result: 'pricing rule')
        expected_response(200 => 'pricing rule')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      let(:pricing_rule_params) do
        {
          name: 'Rule 1',
          rule_type: 'point_to_point',
          price_type: 'fixed'
        }
      end

      params { { id: pricing_rule.id, rule: pricing_rule_params } }

      expected_service_attributes { { pricing_rule: pricing_rule, params: as_params(pricing_rule_params) } }

      on_success do
        stub_service(result: 'pricing rule')
        expected_response(200 => 'pricing rule')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: pricing_rule.id } }

      expected_service_attributes { { pricing_rule: pricing_rule } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422)
      end
    end

    post :copy do
      let(:other_rule) { create(:pricing_rule) }
      let(:params) do
        {
          target_id: pricing_rule.company_id,
          source_id: other_rule.company_id
        }
      end

      expected_service_attributes { { target_id: pricing_rule.company_id.to_s, source_id: other_rule.company_id.to_s } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
