require 'rails_helper'

RSpec.describe CsvReportSender, type: :worker do
  let(:worker) { CsvReportSender.new }
  let(:csv_report) { create :csv_report, :daily, recipients: 'aaa@mail.com, bbb@mail.com, ccc@mail.com' }

  it 'sends an email to each recipient' do
    expect{ worker.perform(csv_report.id) }.to change(ActionMailer::Base.deliveries, :size).by(3)
  end

  it 'calls CsvReports::Export service once' do
    allow(CsvReports::Export).to receive(:new).and_call_original
    expect(CsvReports::Export).to receive(:new).with(csv_report: csv_report).once
    worker.perform(csv_report.id)
  end

  it 'schedules self for csv_report next occurrence' do
    expect(described_class).to receive(:perform_at).with(csv_report.next_occurrence, csv_report.id)
    worker.perform(csv_report.id)
  end
end
