require 'rails_helper'

RSpec.describe InvoicesMailer, type: :mailer do
  let(:company) { create(:company) }
  let(:invoice) { create(:invoice, :overdue, company: company) }
  let(:recipient) { {full_name: 'John Doe', email: 'john@doe.net'} }

  describe '#company_invoice_notification' do
    let(:mail) { InvoicesMailer.company_invoice_notification(invoice.id, recipient) }
    before do
      create(:companyadmin, company: invoice.company)
      invoice.company.company_info.update(address: create(:address))
    end

    it 'renders the headers' do
      expect(mail.subject).to eq("Gett Business Solutions powered by One Transport Invoice No.#{invoice.id} - #{invoice.billing_period_start.year}")
      expect(mail.to).to eq ['john@doe.net']
      expect(mail.from).to eq ["donotreply@gett.com"]
    end

    it 'assigns @user' do
      expect(mail.body.encoded).to match('Dear John Doe')
    end
  end

  describe '#passenger_invoice_created_notification' do
    let(:mail) { InvoicesMailer.passenger_invoice_created_notification(invoice.id, recipient) }
    before do
      create(:companyadmin, company: invoice.company)
      invoice.company.company_info.update(address: create(:address))
    end

    it 'renders the headers' do
      expect(mail.subject).to eq('You have new invoice')
      expect(mail.to).to eq ['john@doe.net']
      expect(mail.from).to eq ["donotreply@gett.com"]
    end

    it 'assigns @user' do
      expect(mail.body.encoded).to match('Dear John Doe')
    end
  end

  describe '#credit_note_notification' do
    let(:invoice) { create(:credit_note) }

    let(:mail) { InvoicesMailer.credit_note_notification(invoice.id, recipient) }

    before do
      create(:companyadmin, company: invoice.company)
      invoice.company.company_info.update(address: create(:address))
    end

    it 'renders the headers' do
      expect(mail.subject).to eq("Gett Business Solutions powered by One Transport - Credit Note")
      expect(mail.to).to eq ['john@doe.net']
      expect(mail.from).to eq ["donotreply@gett.com"]
    end

    it 'assigns @user' do
      expect(mail.body.encoded).to match('Dear John Doe')
    end
  end

  describe '#company_reminder' do
    let(:mail) { InvoicesMailer.company_reminder(invoice.id, recipient) }

    it 'renders the headers' do
      expect(mail.subject).to eq("REMINDER: Gett Business Solutions powered by One Transport Invoice No.#{invoice.id} Due On #{invoice.overdue_at.strftime('%A, %d %b %Y')}")
      expect(mail.to).to eq ['john@doe.net']
      expect(mail.from).to eq ["donotreply@gett.com"]
    end

    it 'assigns @user' do
      expect(mail.body.encoded).to match('Dear John Doe')
    end

    it 'assigns @invoice' do
      expect(mail.body.encoded).to include(invoice.id.to_s)
      expect(mail.body.encoded).to include(invoice.billing_period_start.strftime("%A, %d %b %Y"))
      expect(mail.body.encoded).to include(invoice.billing_period_end.strftime("%A, %d %b %Y"))
    end
  end

  describe '#user_reminder' do
    let(:mail) { InvoicesMailer.user_reminder(invoice.id, recipient) }

    it 'renders the headers' do
      expect(mail.subject).to eq("REMINDER: #{invoice.id} - #{invoice.company.name} (#{invoice.company.id}) is overdue")
      expect(mail.to).to eq ['john@doe.net']
      expect(mail.from).to eq ["donotreply@gett.com"]
    end

    it 'assigns @user' do
      expect(mail.body.encoded).to match('Dear John Doe')
    end

    it 'assigns @invoice' do
      expect(mail.body.encoded).to include(invoice.overdue_at.strftime("%A, %d %b %Y"))
      expect(mail.body.encoded).to include(invoice.company.name.to_s)
      expect(mail.body.encoded).to include(invoice.company.id.to_s)
      expect(mail.body.encoded).to include((Date.current...(invoice.overdue_at + Invoice::ALLOWED_OVERDUE_PERIOD)).count.to_s)
      expect(mail.body.encoded).to include((invoice.overdue_at + Invoice::ALLOWED_OVERDUE_PERIOD).strftime("%A, %d %b %Y"))
    end
  end

  describe '#receipt' do
    let(:mail) { described_class.receipt(invoice.id, recipient) }

    it 'renders the headers' do
      expect(mail.subject).to eq("Gett Business Solutions powered by One Transport Invoice No.#{invoice.id} - Payment Received")
      expect(mail.to).to eq ['john@doe.net']
      expect(mail.from).to eq ["donotreply@gett.com"]
    end

    it 'assigns @invoice' do
      expect(mail.body.encoded).to include invoice.id.to_s
      expect(mail.body.encoded).to include invoice.billing_period_start.strftime("%A, %d %b %Y")
      expect(mail.body.encoded).to include invoice.billing_period_end.strftime("%A, %d %b %Y")
    end
  end

  describe '#account_manager_outstanding_notification' do
    let(:invoice) { create(:cc_invoice, company: company) }
    let(:mail) do
      InvoicesMailer.account_manager_outstanding_notification(invoice.id)
    end

    before do
      company.company_info.update(
        account_manager: create(:user, email: 'account@manager.net')
      )
    end

    it 'renders the headers' do
      expect(mail.subject).to eq("Payment for Invoice No.#{invoice.id} is failed")
      expect(mail.to).to eq(['account@manager.net'])
      expect(mail.from).to eq(["donotreply@gett.com"])
    end

    it 'assigns @invoice and @company' do
      expect(mail.body.encoded).to include(invoice.id.to_s)
      expect(mail.body.encoded).to include(company.name)
    end
  end
end
