require 'rails_helper'

RSpec.describe Admin::StatisticsController, type: :controller do
  let(:admin) { create :user, :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Statistics do
    get :index do
      stub_service(result: 'statistics')

      expected_response(200 => 'statistics')
    end
  end
end
