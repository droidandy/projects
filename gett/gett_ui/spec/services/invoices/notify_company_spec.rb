require 'rails_helper'

RSpec.describe Invoices::NotifyCompany, type: :service do
  let(:company) { create(:company, additional_billing_recipients: 'billing-1@fakemail.com, billing-2@fakemail.com') }
  let(:invoice) { create(:invoice, company: company) }
  let(:billing_contact_email) { 'billing@fakemail.com' }

  before do
    create(:companyadmin, company: company, email: 'admin@fakemail.com')
    create(:finance, company: company, email: 'finance@fakemail.com')
    create(:contact, :billing, company: company, email: billing_contact_email)
    allow(InvoicesMailer).to receive(:company_invoice_notification).and_return(double.as_null_object)
  end

  let(:service) { described_class.new(invoice: invoice) }

  describe 'execution' do
    before { service.execute }

    it 'sends email notifications to all interested recipients' do
      expect(InvoicesMailer).to have_received(:company_invoice_notification).with(invoice.id, hash_including('email' => 'admin@fakemail.com'))
      expect(InvoicesMailer).to have_received(:company_invoice_notification).with(invoice.id, hash_including('email' => 'finance@fakemail.com'))
      expect(InvoicesMailer).to have_received(:company_invoice_notification).with(invoice.id, hash_including('email' => 'billing@fakemail.com'))
      expect(InvoicesMailer).to have_received(:company_invoice_notification).with(invoice.id, hash_including('email' => 'billing-1@fakemail.com'))
      expect(InvoicesMailer).to have_received(:company_invoice_notification).with(invoice.id, hash_including('email' => 'billing-2@fakemail.com'))
    end

    context 'when billing contaxt has no email' do
      let(:billing_contact_email) { '' }

      it "doesn't try to send notification to empty email" do
        # 4 emails to account that have email address
        expect(InvoicesMailer).to have_received(:company_invoice_notification).exactly(4).times
        expect(InvoicesMailer).not_to have_received(:company_invoice_notification).with(invoice.id, hash_including('email' => ''))
      end
    end
  end
end
