require 'rails_helper'

RSpec.describe PaymentCards::Tokenize, type: :service do
  let(:payment_card) do
    create :payment_card,
      card_number:      '1111222233334444',
      cvv:              '111',
      holder_name:      'MOKER',
      expiration_month: '12',
      expiration_year:  '2017',
      token:            nil
  end

  let(:service) { PaymentCards::Tokenize.new(payment_card: payment_card) }

  describe '#execute' do
    let(:token_service) { double('PaymentsOS::CreateToken') }

    before do
      expect(PaymentsOS::CreateToken).to receive(:new)
        .with(card_params: {
          card_number:      '1111222233334444',
          cvv:              '111',
          holder_name:      'MOKER',
          expiration_month: 12,
          expiration_year:  2017
        }).and_return(token_service)

      allow(token_service).to receive_message_chain(:execute, :result)
        .and_return(payments_os_result)
    end

    context 'when PaymentsOS service executes successfully' do
      let(:payments_os_result) { 'token' }

      it 'updates payment card' do
        expect{ service.execute }.to change{ payment_card.token }.from(nil).to('token')
      end

      it 'is successful' do
        expect(service.execute).to be_success
      end
    end

    context 'when PaymentsOS service execution fails' do
      let(:payments_os_result) { nil }

      it 'updates payment card' do
        expect{ service.execute }.not_to change{ payment_card.token }
      end

      it 'is not successful' do
        expect(service.execute).not_to be_success
      end
    end
  end
end
