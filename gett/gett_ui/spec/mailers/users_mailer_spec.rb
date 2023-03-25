require 'rails_helper'

describe UsersMailer do
  describe '#invitation' do
    let(:company) { create(:company) }
    let(:booker)  { create(:booker, company: company) }

    subject(:mail) { UsersMailer.reset_password(booker.id) }

    its(:subject)       { is_expected.to eql "Reset password instruction" }
    its(:to)            { is_expected.to eql [booker.email] }
    its(:from)          { is_expected.to eql ['donotreply@gett.com'] }
    its('body.encoded') { is_expected.to include booker.full_name }
    its(:body)          { is_expected.to include 'Download new Gett Business Solutions app' }

    context 'when company is not enterprise' do
      let(:company) { create(:company, :bbc) }

      it "doesn't have extra block content in mail body" do
        expect(mail.body).not_to include('Download new Gett Business Solutions app')
      end
    end
  end
end
