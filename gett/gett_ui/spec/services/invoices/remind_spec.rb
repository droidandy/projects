require 'rails_helper'

RSpec.describe Invoices::Remind, type: :service do
  let(:company) do
    create(:company, additional_billing_recipients: 'billing-1@fakemail.com, billing-2@fakemail.com',
      account_manager_id: account_manager_id, salesman_id: salesman_id
    )
  end
  let(:account_manager_id) { nil }
  let(:salesman_id) { nil }
  let(:invoice) { create(:invoice, company: company) }

  let(:service) { described_class.new(invoice: invoice, office: office) }

  describe 'execution' do
    context 'front office reminder' do
      let(:office) { :front }

      before do
        create(:companyadmin, company: company, email: 'admin@fakemail.com')
        create(:finance, company: company, email: 'finance@fakemail.com')
        create(:contact, :billing, company: company, email: 'billing@fakemail.com')
        allow(InvoicesMailer).to receive(:company_reminder).and_return(double.as_null_object)
        service.execute
      end

      it 'sends email notifications to all front office recipients' do
        expect(InvoicesMailer).to have_received(:company_reminder).with(invoice.id, hash_including('email' => 'admin@fakemail.com'))
        expect(InvoicesMailer).to have_received(:company_reminder).with(invoice.id, hash_including('email' => 'finance@fakemail.com'))
        expect(InvoicesMailer).to have_received(:company_reminder).with(invoice.id, hash_including('email' => 'billing@fakemail.com'))
        expect(InvoicesMailer).to have_received(:company_reminder).with(invoice.id, hash_including('email' => 'billing-1@fakemail.com'))
        expect(InvoicesMailer).to have_received(:company_reminder).with(invoice.id, hash_including('email' => 'billing-2@fakemail.com'))
      end
    end

    context 'back office reminder' do
      let(:office)          { :back }
      let(:salesman)        { create(:user, :sales, email: 'salesman@fakemail.com') }
      let(:account_manager) { create(:user, :sales, email: 'account_manager@fakemail.com') }

      before do
        allow(InvoicesMailer).to receive(:user_reminder).and_return(double.as_null_object)
        service.execute
      end

      context 'company has account manager and salesman' do
        let(:account_manager_id) { account_manager.id }
        let(:salesman_id)        { salesman.id }

        it 'sends email notification to account manager' do
          expect(InvoicesMailer).to have_received(:user_reminder).with(invoice.id, hash_including('email' => 'account_manager@fakemail.com'))
        end
      end

      context 'company has no account manager and has salesman' do
        let(:salesman_id) { salesman.id }

        it 'sends email notification to salesman' do
          expect(InvoicesMailer).to have_received(:user_reminder).with(invoice.id, hash_including('email' => 'salesman@fakemail.com'))
        end
      end

      context 'company has no account manager and no salesman' do
        it 'sends email notification to salesman' do
          expect(InvoicesMailer).not_to have_received(:user_reminder)
        end
      end
    end
  end
end
