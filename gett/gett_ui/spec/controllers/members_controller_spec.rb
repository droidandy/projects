require 'rails_helper'

RSpec.describe MembersController, type: :controller do
  let(:company) { create :company }
  let(:admin)   { create :admin, company: company }
  let!(:member) { create :passenger, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Members do
    put :invite do
      let(:service_class) { Members::InviteAll }

      stub_service(result: 'invitations_channel')

      expected_response(201 => {channel: 'invitations_channel'}.to_json)
    end

    put :reinvite do
      params { { id: member.id } }

      expected_service_attributes { { member: member } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
