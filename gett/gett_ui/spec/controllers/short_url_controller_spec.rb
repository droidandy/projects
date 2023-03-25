require 'rails_helper'

RSpec.describe ShortUrlsController, type: :controller do
  let(:company) { create :company }
  let(:admin)   { create :admin, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: ShortUrls do
    get :show do
      params { { id: 'some_id' } }

      expected_service_attributes { { token: 'some_id' } }
      stub_service(result: 'link')

      expected_response(200 => 'link')
    end
  end
end
