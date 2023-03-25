require 'rails_helper'

RSpec.describe CsvReports::Show, type: :service do
  let(:company)     { create :company }
  let!(:csv_report) { create :csv_report, company: company }

  subject(:service) { described_class.new(csv_report: csv_report) }

  it { is_expected.to be_authorized_by(CsvReports::Policy) }

  describe '#execute' do
    service_context { { company: company } }

    subject(:result) { service.execute.result }

    it {
      is_expected.to include(
        'id' => csv_report.id,
        'name' => csv_report.name,
        'recurrence' => csv_report.recurrence
      )
    }
  end
end
