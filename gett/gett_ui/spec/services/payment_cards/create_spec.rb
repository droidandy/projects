require 'rails_helper'

RSpec.describe PaymentCards::Create, type: :service do
  it { is_expected.to be_authorized_by PaymentCards::CreatePolicy }

  describe '#execute' do
    let(:passenger) { create(:passenger) }
    let(:service)   { PaymentCards::Create.new(passenger: passenger, params: params) }

    context 'with valid card details' do
      let(:tokenization_result) { true }

      let(:params) do
        {
          card_number: '4111111111111111',
          cvv: '1234',
          holder_name: 'John Mark',
          expiration_month: Date.current.month,
          expiration_year: Date.current.year + 1,
          personal: true
        }
      end

      before do
        token_service = double
        expect(PaymentCards::Tokenize).to receive(:new)
          .with(payment_card: instance_of(PaymentCard)).and_return(token_service)
        allow(token_service).to receive_message_chain(:execute, :success?).and_return(tokenization_result)
      end

      context 'when tokenization was successful' do
        it 'creates new payment card' do
          expect{ service.execute }.to change(PaymentCard, :count).by(1)
            .and change(passenger.payment_cards_dataset, :count).by(1)
        end

        it 'is successful' do
          expect(service.execute).to be_success
        end
      end

      context 'when tokenization was not successful' do
        let(:tokenization_result) { false }

        it 'does not create new payment card' do
          expect{ service.execute }.not_to change(PaymentCard, :count)
        end

        it 'is not successful' do
          expect(service.execute).not_to be_success
        end

        it 'has errors' do
          expect(service.execute.errors).to be_present
        end
      end

      describe 'make created cart as default' do
        context 'first card of a passenger' do
          before { service.execute }

          it { expect(passenger.payment_cards_dataset.last.default).to be true }
        end

        context 'not first card of a passenger' do
          before do
            create(:payment_card, passenger: passenger)
            service.execute
          end

          it { expect(passenger.payment_cards_dataset.last.default).to be false }
        end
      end
    end

    context 'with card token' do
      let(:params) do
        {
          token: 'token123',
          holder_name: 'John Doe'
        }
      end

      before do
        expect(service).to receive_message_chain(:token_info_service, :execute, :result).and_return(
          last_4: '1234',
          expiration_year: 2020,
          expiration_month: 12
        )
      end

      it 'fetches details and creates a card' do
        expect{ service.execute }.to change(PaymentCard, :count).by(1)
      end
    end

    context 'with invalid params' do
      let(:params) do
        {
          card_number: '1',
          cvv: '2',
          holder_name: 'John Mark',
          expiration_month: '',
          expiration_year: '',
          personal: true
        }
      end

      before { expect(PaymentCards::Tokenize).not_to receive(:new) }

      it 'does not create new payment card' do
        expect{ service.execute }.not_to change(PaymentCard, :count)
      end

      it 'is not successful' do
        expect(service.execute).not_to be_success
      end

      it 'has errors' do
        expect(service.execute.errors).to be_present
      end
    end
  end
end
