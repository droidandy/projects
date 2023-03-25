require 'rails_helper'

RSpec.describe Invoices::Receipt, type: :service do
  let(:company) { create(:company, additional_billing_recipients: 'billing-1@fakemail.com, billing-2@fakemail.com') }
  let(:invoice) { create(:invoice, company: company) }

  before do
    create(:companyadmin, company: company, email: 'admin@fakemail.com')
    create(:finance, company: company, email: 'finance@fakemail.com')
    create(:contact, :billing, company: company, email: 'billing@fakemail.com')
    allow(InvoicesMailer).to receive(:receipt).and_return(double.as_null_object)
  end

  let(:service) { Invoices::Receipt.new(invoice: invoice) }

  describe 'execution' do
    before { service.execute }

    it 'sends email receipts to all interested recipients' do
      expect(InvoicesMailer).to have_received(:receipt).with(invoice.id, hash_including('email' => 'admin@fakemail.com'))
      expect(InvoicesMailer).to have_received(:receipt).with(invoice.id, hash_including('email' => 'finance@fakemail.com'))
      expect(InvoicesMailer).to have_received(:receipt).with(invoice.id, hash_including('email' => 'billing@fakemail.com'))
      expect(InvoicesMailer).to have_received(:receipt).with(invoice.id, hash_including('email' => 'billing-1@fakemail.com'))
      expect(InvoicesMailer).to have_received(:receipt).with(invoice.id, hash_including('email' => 'billing-2@fakemail.com'))
    end
  end
end
