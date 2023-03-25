require 'rails_helper'

describe ImportMailer do
  describe '#error_report' do
    let(:company) { create(:company) }

    subject do
      described_class.error_report(
        company.id,
        [{'line' => 1, 'errors' => ['error1', 'error2']}],
        true
      )
    end

    its(:subject) { is_expected.to eql 'HR Feed Error' }
    its(:to) { is_expected.to eql ['anton.macius@gett.com'] }
    its(:from) { is_expected.to eql ['donotreply@gett.com'] }
    its('body.encoded') { is_expected.to include(company.name) }
    its('body.encoded') { is_expected.to include('Line 1: error1, error2') }
    its('body.encoded') { is_expected.to include('The CSV file had an invalid encoding') }
  end
end
