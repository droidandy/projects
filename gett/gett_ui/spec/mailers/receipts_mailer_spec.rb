require 'rails_helper'

describe ReceiptsMailer do
  let(:passenger) { create :passenger, email: 'pass@anger.com' }
  let(:zip_path)  { Rails.root.join('spec/fixtures/files/Name_Lastname.zip') }
  let(:params) do
    {
      from_date: "30 October ‘17",
      to_date:   "06 November ‘17",
      zip_path:  zip_path
    }
  end

  describe '#receipts_for_passenger' do
    subject { ReceiptsMailer.receipts_for_passenger(passenger, params) }

    its(:subject) { is_expected.to eq 'Your weekly Gett Business Solutions powered by One Transport Credit/Debit Card Receipts' }
    its(:to)      { is_expected.to eq ['pass@anger.com'] }
    its(:from)    { is_expected.to eq ['donotreply@gett.com'] }

    it { expect(subject.attachments.first.filename).to eq('Name_Lastname.zip') }
  end

  describe '#receipts_for_booker' do
    let(:booker) { create :booker, email: 'book@er.com' }

    subject { ReceiptsMailer.receipts_for_booker(booker, passenger, params) }

    its(:subject) { is_expected.to eq "Weekly #{passenger.full_name} Gett Business Solutions powered by One Transport Credit/Debit Card Receipts" }
    its(:to)      { is_expected.to eq ['book@er.com'] }
    its(:from)    { is_expected.to eq ['donotreply@gett.com'] }

    it { expect(subject.attachments.first.filename).to eq('Name_Lastname.zip') }
  end
end
