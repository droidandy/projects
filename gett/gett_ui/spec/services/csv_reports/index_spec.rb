require 'rails_helper'

RSpec.describe CsvReports::Index, type: :service do
  let(:company) { create :company }

  subject(:service) { described_class.new }

  it { is_expected.to be_authorized_by(CsvReports::Policy) }

  describe '#execute' do
    service_context { { company: company } }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
