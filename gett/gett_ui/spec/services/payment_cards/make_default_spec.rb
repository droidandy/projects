require 'rails_helper'

RSpec.describe PaymentCards::MakeDefault, type: :service do
  it { is_expected.to be_authorized_by PaymentCards::Policy }

  describe '#execute' do
    let(:card)    { create :payment_card }
    let(:service) { PaymentCards::MakeDefault.new(payment_card: card) }

    it 'sets payment card as default' do
      expect{ service.execute }.to change{ card.default? }.from(false).to(true)
    end

    context 'when other payment card is set to default' do
      let!(:other_card) { create :payment_card, default: true, passenger: card.passenger }

      it 'sets other card back to not being default' do
        expect{ service.execute }.to change{ other_card.reload.default? }.from(true).to(false)
      end
    end
  end
end
