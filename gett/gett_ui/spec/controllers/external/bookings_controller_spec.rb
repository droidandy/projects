require 'rails_helper'

RSpec.describe External::BookingsController, type: :controller do
  let(:back_office_user) { create(:user, :admin) }

  let(:companyadmin) { create(:companyadmin) }
  let(:company) { companyadmin.company }

  let(:master_token) { create(:api_key, user: back_office_user).key }
  let(:company_token) { create(:api_key, user: companyadmin).key }

  let(:booking) { create(:booking, booker: companyadmin) }

  it_behaves_like 'service controller', module: External::Bookings do
    get :index do
      let(:sample_params) do
        {
          page: '1',
          order: 'name',
          reverse: 'false',
          search: '',
          final: 'true',
          not_final: 'false',
          from: 'timestamp',
          to: 'other timestamp',
          status: ['completed'],
          ids: ['1'],
          vehicle_types: ['exec'],
          include_passenger_ids: ['1', '2'],
          exclude_passenger_ids: ['2', '3']
        }
      end

      params { sample_params.merge(company_id: company.id) }

      expected_service_attributes { { query: as_params(sample_params) } }

      context 'authorization with company token' do
        before do
          request.headers['X-API-Key'] = company_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(company: company, user: companyadmin, member: companyadmin, original_user: nil, reincarnated: false))
            .and_call_original
        end

        stub_service(result: 'bookings list')
        expected_response(200 => 'bookings list')
      end

      context 'authorization with master token' do
        before do
          request.headers['X-API-Key'] = master_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(company: company, user: nil, member: nil, original_user: nil, reincarnated: false))
            .and_call_original
        end

        stub_service(result: 'bookings list')
        expected_response(200 => 'bookings list')
      end
    end

    get :show do
      let(:service_class) { ::Bookings::Show }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking } }

      context 'authorization with company token' do
        before do
          request.headers['X-API-Key'] = company_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(company: company, user: companyadmin, member: companyadmin, original_user: nil, reincarnated: false))
            .and_call_original
        end

        stub_service(result: 'booking show data')
        expected_response(200 => 'booking show data')
      end

      context 'authorization with master token' do
        before do
          request.headers['X-API-Key'] = master_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(user: companyadmin, member: companyadmin, original_user: back_office_user, reincarnated: true))
            .and_call_original
        end

        stub_service(result: 'booking show data')
        expected_response(200 => 'booking show data')
      end
    end

    put :update do
      let(:service_class) { External::Bookings::Modify }

      params { { id: booking.id, booking: {vehicle_value: 'value'} } }

      expected_service_attributes { { booking: booking, params: as_params(vehicle_value: 'value') } }

      context 'authorization with company token' do
        before do
          request.headers['X-API-Key'] = company_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(user: companyadmin, member: companyadmin, original_user: nil, reincarnated: false))
            .and_call_original
        end

        on_success do
          stub_service(show_result: 'booking')
          expected_response(200 => 'booking')
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end

      context 'authorization with master token' do
        before do
          request.headers['X-API-Key'] = master_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(user: companyadmin, member: companyadmin, original_user: back_office_user, reincarnated: true))
            .and_call_original
        end

        on_success do
          stub_service(show_result: 'booking')
          expected_response(200 => 'booking')
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end
    end

    put :cancel do
      let(:service_class) { Bookings::Cancel }

      params { { id: booking.id } }

      expected_service_attributes { { booking: booking, params: {} } }
      stub_service{ { booking_data: 'booking show data' } }

      context 'authorization with company token' do
        before do
          request.headers['X-API-Key'] = company_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(user: companyadmin, member: companyadmin, original_user: nil, reincarnated: false))
            .and_call_original
        end

        on_success do
          expected_response(200 => 'booking show data')
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end

      context 'authorization with master token' do
        before do
          request.headers['X-API-Key'] = master_token

          expect(ApplicationService::Context).to receive(:with_context)
            .with(hash_including(user: companyadmin, member: companyadmin, original_user: back_office_user, reincarnated: true))
            .and_call_original
        end

        on_success do
          expected_response(200 => 'booking show data')
        end

        on_failure do
          stub_service(errors: 'errors')
          expected_response(422 => {errors: 'errors'}.to_json)
        end
      end
    end
  end
end
