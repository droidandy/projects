require 'rails_helper'

RSpec.describe System::Check::FinancePortalApi::All do
  let(:current_user) { create(:user) }

  subject { described_class.new(current_user) }

  describe '#execute' do
    before(:each) do
      stub_service(System::Check::FinancePortalApi::DriverStats, success?: 1)
      stub_service(System::Check::FinancePortalApi::Order, success?: 2)
      stub_service(System::Check::FinancePortalApi::StatementHTML, success?: 3)
      stub_service(System::Check::FinancePortalApi::Statements, success?: 4)
      subject.execute!
    end

    it 'should return valid results' do
      expect(subject.results).to eq(
        {
          driver_stats: 1,
          order: 2,
          statement_html: 3,
          statements: 4
        }
      )
    end
  end
end
