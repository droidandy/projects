require 'rails_helper'

RSpec.describe Earnings::List do
  describe '#execute!' do
    let(:body) { json_body('gett/earnings_api/earnings') }
    let(:gett_id) { 1234 }
    let(:current_user) { create(:user, :with_site_admin_role, gett_id: gett_id) }

    let(:from) { '2017-11-30T08:20:37Z' }
    let(:to) { '2017-12-30T08:20:37Z' }

    subject { described_class.new(current_user, params) }
    before(:each) { stub_client(GettEarningsApi::Client, :earnings, body) }

    context 'with valid params' do
      let(:from) { '2017-11-30T08:20:37Z' }
      let(:to) { '2017-12-30T08:20:37Z' }

      let(:params) do
        {
          driver: current_user,
          from: from,
          to: to
        }
      end

      it 'should pass valid params' do
        expect_any_instance_of(GettEarningsApi::Client).to receive(:earnings)
          .with(driver_id: gett_id, from: from, to: to)
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'runs successfully' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'returns valid amount of data' do
        subject.execute!
        expect(subject.earnings.count).to eq(2)
      end
    end

    context 'with pagination' do
      let(:body) { { transactions: (1..7).map { |i| { external_id: i, amount_inc_tax: 123 } } }.to_json }

      let(:params) do
        {
          driver: current_user,
          from: from,
          to: to,
          page: 3,
          per_page: 2
        }
      end

      it 'paginates' do
        subject.execute!
        expect(subject.earnings.count).to eq(2)
        expect(subject.earnings.map { |e| e[:external_id] }).to eq([5,6])
      end
    end

    context 'with invalid params' do
      let(:params) do
        {
          driver: current_user,
          from: 'from',
          to: 'to'
        }
      end

      it 'runs with errors' do
        subject.execute!
        expect(subject).not_to be_success
      end

      it 'should contain errors' do
        subject.execute!
        expect(subject.errors.count).to eq(2)
      end
    end

    context 'with invalid response' do
      let(:params) do
        {
          driver: current_user,
          from: from,
          to: to
        }
      end

      before(:each) do
        stub_client(GettEarningsApi::Client, :earnings, [].to_json, 500)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
      end

      it 'has errors' do
        subject.execute!
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end
  end
end
