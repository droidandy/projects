require 'rails_helper'

RSpec.describe Incomings::SplytController do
  describe '#event' do
    let(:authenticated) { true }

    before { allow_any_instance_of(described_class).to receive(:authenticated?).and_return(authenticated) }

    context 'when authenticated' do
      let(:event_handler)             { double(:event_handler) }
      let(:event_handler_with_result) { double(:event_handler_with_result, success?: success) }
      let(:success)                   { true }
      let(:params) do
        {
          event: {
            name: 'name',
            time: Time.current.to_s
          },
          data: {
            booking_id: '1000',
            status: 'status'
          }
        }
      end

      before do
        allow(Incomings::Splyt::EventHandler).to receive(:new)
          .with(params: params)
          .and_return(event_handler)
        allow(event_handler).to receive(:execute).and_return(event_handler_with_result)
      end

      it 'calls event handler service' do
        expect(event_handler).to receive(:execute)

        post :event, params: params
      end

      context 'when event hendled successfully' do
        it 'returns 200 OK' do
          post :event, params: params

          expect(response.status).to eq(200)
        end
      end

      context 'when event hendled is not successfully' do
        let(:success)       { false }
        let(:event_handler) { double(:event_handler, errors: 'Test Error') }
        let(:errors)        { { errors: event_handler.errors } }

        it 'returns 500 status code with error message' do
          post :event, params: params

          expect(response.status).to eq(500)
          expect(response.body).to   eq(errors.to_json)
        end
      end
    end

    context 'when not authenticated' do
      let(:authenticated) { false }

      it 'returns head 401' do
        post :event

        expect(response.status).to eq(401)
      end
    end
  end
end
