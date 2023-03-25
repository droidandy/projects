require 'rails_helper'

describe MembersMailer, type: :mailer do
  describe '#invitation' do
    let(:company) { create(:company, :with_contact) }
    let(:booker)  { create(:booker, company: company) }
    let(:mail)    { described_class.invitation(booker.id) }

    it 'renders the subject' do
      expect(mail.subject).to eql "#{booker.full_name}, Welcome to Gett Business Solutions powered by One Transport"
    end

    it 'renders the receiver email' do
      expect(mail.to).to eql [booker.email]
    end

    it 'renders the sender email' do
      expect(mail.from).to eql ["donotreply@gett.com"]
    end

    it 'renders the sender name' do
      expect(mail[:from].display_names).to eql ["Gett Business Solutions"]
    end

    it 'renders full_name in body' do
      expect(mail.body.encoded).to include booker.full_name
    end

    describe 'administrator full name' do
      context 'when company primary contact is present' do
        let(:company) { create(:company) }

        before { create(:contact, company_id: company.id, first_name: 'Company', last_name: 'Contact') }

        it 'renders company contact in body' do
          expect(mail.body.encoded).to include 'Company Contact, administrator'
        end
      end

      context 'when company primary contact does not exists' do
        let(:company) { create(:company) }

        before { create(:companyadmin, company: company, first_name: 'John', last_name: 'Smith') }

        it 'renders admin full_name in body' do
          expect(mail.body.encoded).to include 'John Smith, administrator'
        end
      end
    end

    context 'when company primary contact full name is empty string' do
      before do
        create(:companyadmin, company: company, first_name: 'John', last_name: 'Smith')
        company.reload
        company.primary_contact.update(first_name: '', last_name: '')
      end

      it 'renders admin full_name in body' do
        expect(mail.body.encoded).to include 'John Smith, administrator'
      end
    end

    context 'when company is not enterprise' do
      let(:company) { create(:company, :with_contact, :bbc) }

      it "doesn't have extra block content in mail body" do
        expect(mail.body.encoded).not_to include('Download new Gett Business Solutions app')
      end
    end
  end
end
