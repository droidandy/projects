require 'rails_helper'

RSpec.describe Admin::CommentsController, type: :controller do
  let(:admin) { create :user, :admin }

  before { sign_in admin }

  context 'company resource' do
    let(:company) { create :company }

    it_behaves_like 'service controller', module: Admin::CompanyComments do
      get :index do
        params { { company_id: company.id } }

        expected_service_attributes { { company: company } }

        stub_service(result: 'comments list')

        expected_response(200 => 'comments list')
      end

      post :create do
        params { { company_id: company.id, comment: {text: 'Text'} } }

        expected_service_attributes { { company: company, params: as_params(text: 'Text') } }

        on_success do
          stub_service(show_result: 'data')
          expected_response(200 => {comment: 'data'}.to_json)
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end
    end
  end

  context 'member resource' do
    let(:member) { create :member }

    it_behaves_like 'service controller', module: Admin::MemberComments do
      get :index do
        params { { member_id: member.id } }

        expected_service_attributes { { member: member } }

        stub_service(result: 'comments list')

        expected_response(200 => 'comments list')
      end

      post :create do
        params { { member_id: member.id, comment: {text: 'Text'} } }

        expected_service_attributes { { member: member, params: as_params(text: 'Text') } }

        on_success do
          stub_service(show_result: 'data')
          expected_response(200 => {comment: 'data'}.to_json)
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end
    end
  end

  context 'booking resource' do
    let(:booking) { create :booking }

    it_behaves_like 'service controller', module: Admin::BookingComments do
      get :index do
        params { { booking_id: booking.id } }

        expected_service_attributes { { booking: booking } }

        stub_service(result: 'comments list')

        expected_response(200 => 'comments list')
      end

      post :create do
        params { { booking_id: booking.id, comment: {text: 'Text'} } }

        expected_service_attributes { { booking: booking, params: as_params(text: 'Text') } }

        on_success do
          stub_service(show_result: 'data')
          expected_response(200 => {comment: 'data'}.to_json)
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end
    end
  end
end
