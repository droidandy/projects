require 'rails_helper'

RSpec.describe CsvReports::Form, type: :service do
  let(:company) { create :company }

  subject(:service) { described_class.new }

  it { is_expected.to be_authorized_by(CsvReports::Policy) }

  describe '#execute' do
    service_context { { company: company } }

    subject(:result) { service.execute.result }

    it { is_expected.to include :csv_report, :recurrence_options }
  end
end
