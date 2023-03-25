require 'rails_helper'

RSpec.describe PaymentCards::Destroy, type: :service do
  it { is_expected.to be_authorized_by PaymentCards::DestroyPolicy }

  describe '#execute' do
    let(:card)    { create :payment_card }
    let(:service) { PaymentCards::Destroy.new(payment_card: card) }

    it 'deactivates payment card' do
      expect{ service.execute }.to change{ card.active? }.from(true).to(false)
    end
  end
end
