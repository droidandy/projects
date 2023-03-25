require 'rails_helper'

RSpec.describe System::Check::EarningsApi::Earnings do
  let(:current_user) { create(:user) }

  subject { described_class.new(current_user) }

  describe '#execute' do
    before(:each) do
      stub_client(GettEarningsApi::Client, :earnings, {}.to_json, status)
      subject.execute!
    end

    context 'with successful response' do
      let(:status) { 200 }

      it 'should be successful' do
        expect(subject).to be_success
      end
    end

    context 'with bad response' do
      let(:status) { 400 }

      it 'should not be successful' do
        expect(subject).not_to be_success
      end
    end
  end
end
