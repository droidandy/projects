require 'rails_helper'

RSpec.describe CsvReports::Destroy, type: :service do
  let!(:csv_report) { create :csv_report }
  let(:service)     { described_class.new(csv_report: csv_report) }

  it { is_expected.to be_authorized_by(CsvReports::Policy) }

  describe '#execute' do
    let(:scheduled_job) { double }

    before do
      allow(csv_report).to receive(:scheduled_jobs).and_return([scheduled_job])
      allow(scheduled_job).to receive(:delete)
    end

    it 'destroys CSV report' do
      expect{ service.execute }.to change(CsvReport, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    it 'deletes related scheduled job' do
      service.execute
      expect(scheduled_job).to have_received(:delete)
    end
  end
end
