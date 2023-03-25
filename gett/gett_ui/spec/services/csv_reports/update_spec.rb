require 'rails_helper'

RSpec.describe CsvReports::Update, type: :service do
  it { is_expected.to be_authorized_by(CsvReports::Policy) }

  describe '#execute' do
    let(:company) { create :company }
    let!(:csv_report) { create :csv_report, :monthly, company: company }

    service_context { { company: company } }

    subject(:service) { described_class.new(csv_report: csv_report, params: params) }

    context 'with valid params' do
      let(:params) { { name: 'new name' } }
      let(:scheduled_job) { double }

      before do
        allow(csv_report).to receive(:scheduled_jobs).and_return([scheduled_job])
        allow(scheduled_job).to receive(:delete)
      end

      it 'creates new CSV report' do
        expect{ service.execute }.to change{ csv_report.reload.name }.to('new name')
      end

      it 'reschedules the job' do
        expect(scheduled_job).to receive(:delete)
        expect(CsvReportSender).to receive(:perform_at).once
        service.execute
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:csv_report) { is_expected.to be_persisted }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not create new CSV report' do
        expect{ service.execute }.not_to change{ csv_report.reload.name }
      end

      describe 'execution results' do
        before do
          expect(service).not_to receive(:reschedule_sender_job)
          service.execute
        end

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
