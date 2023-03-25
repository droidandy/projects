require 'rails_helper'

describe GoCardless::MandateEventProcessor, type: :service do
  let!(:company) { create(:company) }
  let!(:companyadmin) { create(:companyadmin, company: company) }
  let!(:mandate) { create(:direct_debit_mandate, company: company, go_cardless_mandate_id: 'id') }

  subject(:service) { GoCardless::MandateEventProcessor.new(mandate: mandate, event: event) }

  describe 'mandate activated' do
    let(:event) { { action: 'active' } }

    it 'updates mandate' do
      expect{ service.execute }.to change{ mandate.reload.status }
        .to(DirectDebitMandate::ACTIVE)
    end

    it 'send an email notification' do
      service.execute
      mail = ActionMailer::Base.deliveries.last
      expect(mail.body).to include('has been approved')
    end
  end

  describe 'mandate failed' do
    let(:event) { { action: 'failed' } }

    it 'updates mandate' do
      expect{ service.execute }.to change{ mandate.reload.status }
        .to(DirectDebitMandate::FAILED)
    end

    it 'send an email notification' do
      service.execute
      mail = ActionMailer::Base.deliveries.last
      expect(mail.body).to include('has been declined')
    end
  end

  describe 'mandate cancelled' do
    let(:event) { { action: 'cancelled' } }

    it 'updates mandate' do
      expect{ service.execute }.to change{ mandate.reload.status }
        .to(DirectDebitMandate::CANCELLED)
    end

    it 'send an email notification' do
      service.execute
      mail = ActionMailer::Base.deliveries.last
      expect(mail.body).to include('has been cancelled')
    end
  end

  describe 'mandate replaced' do
    let(:event) { { action: 'replaced', links: { new_mandate: 'new_id' } } }

    it 'updates mandate' do
      expect{ service.execute }.to change{ mandate.reload.status }
        .to(DirectDebitMandate::ACTIVE)
      expect(mandate.go_cardless_mandate_id).to eq('new_id')
    end

    it 'send an email notification' do
      service.execute
      mail = ActionMailer::Base.deliveries.last
      expect(mail.body).to include('has been approved')
    end
  end
end
