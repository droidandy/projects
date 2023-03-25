require 'rails_helper'

describe CompanyMailer do
  describe '#signup_request' do
    let(:request) { create(:company_signup_request) }

    subject(:mail) { described_class.signup_request(request.id) }

    its(:subject)       { is_expected.to eql "We've received your sign up request" }
    its(:to)            { is_expected.to eql ['anton.macius@gett.com'] }
    its('body.encoded') { is_expected.to include request.name }

    it 'renders sender name and email' do
      expect(mail.from).to eql ["donotreply@gett.com"]
      expect(mail[:from].display_names).to eql ["Gett Business Solutions"]
    end
  end
end
