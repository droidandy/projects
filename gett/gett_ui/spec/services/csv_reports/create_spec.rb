require 'rails_helper'

RSpec.describe CsvReports::Create, type: :service do
  it { is_expected.to be_authorized_by(CsvReports::Policy) }

  describe '#execute' do
    before { Timecop.freeze(Time.current.change(nsec: 0)) }
    after { Timecop.return }

    let!(:company) { create :company }

    service_context { { company: company } }

    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) do
        {
          name: 'CSV report',
          recurrence: 'monthly',
          recurrence_starts_at: Time.current,
          recipients: 'some@mail.com, some@mail.ru',
          headers: { company_name: true }
        }
      end

      it 'creates new CSV report' do
        expect{ service.execute }.to change(CsvReport, :count).by(1)
      end

      describe 'execution results' do
        before do
          expect(CsvReportSender).to receive(:perform_at).once
          service.execute
        end

        it { is_expected.to be_success }
        its(:csv_report) { is_expected.to be_persisted }
        its('csv_report.name') { is_expected.to eq 'CSV report' }
        its('csv_report.recurrence') { is_expected.to eq 'monthly' }
        its('csv_report.recurrence_starts_at') { is_expected.to eq Time.current }
        its('csv_report.recipients') { is_expected.to eq 'some@mail.com, some@mail.ru' }
        its('csv_report.headers') { is_expected.to eq 'company_name' => 'true' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not create new CSV report' do
        expect{ service.execute }.not_to change(CsvReport, :count)
      end

      describe 'execution results' do
        before do
          expect(CsvReportSender).not_to receive(:perform_at)
          service.execute
        end

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
