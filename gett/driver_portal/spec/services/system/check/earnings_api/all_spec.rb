require 'rails_helper'

RSpec.describe System::Check::EarningsApi::All do
  let(:current_user) { create(:user) }

  subject { described_class.new(current_user) }

  describe '#execute' do
    before(:each) do
      stub_service(System::Check::EarningsApi::Earnings, success?: 1)
      subject.execute!
    end

    it 'should return valid results' do
      expect(subject.results).to eq({ earnings: 1 })
    end
  end
end
