require 'rails_helper'

describe CsvReportsMailer, type: :mailer do
  let(:csv_report) { create(:csv_report, :monthly, recipients: 'aaa@mail.com, bbb@mail.com') }
  let(:recipient)  { 'aaa@mail.com' }
  let(:attachment) { double(filename: 'csv attachment', length: 1000) }

  describe '#report' do
    let(:mail) { described_class.report(csv_report.id, recipient, attachment) }

    it 'renders the headers' do
      expect(mail.subject).to eq("Your Monthly Gett Business Solutions powered by One Transport Rides CSV file")
      expect(mail.to).to eq ['aaa@mail.com']
      expect(mail.from).to eq ["donotreply@gett.com"]
      expect(mail.attachments.first.filename).to eq("monthly_report.csv")
    end

    context 'when recipient is na existing member' do
      before { create(:admin, email: 'aaa@mail.com', first_name: 'John', last_name: 'Smith') }

      it 'renders greeting for recognized member' do
        expect(mail.body.encoded).to include('Dear John Smith,')
      end
    end
  end
end
