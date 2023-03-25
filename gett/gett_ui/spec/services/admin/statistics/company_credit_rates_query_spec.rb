require 'rails_helper'

RSpec.describe Admin::Statistics::CompanyCreditRatesQuery, type: :service do
  subject(:query) { described_class.new(query_params).values }

  let(:company) { create(:company) }

  describe '#base_scope' do
    let(:query_params) { {} }
    let!(:credit_rate) { create(:company_credit_rate, company: company) }

    its(:count) { is_expected.to eq 1 }
  end

  describe '#group' do
    context 'month, date with all' do
      let!(:credit_rate_1) { create(:company_credit_rate, value: 1, created_at: DateTime.new(2010, 1, 1, 0, 0)) }
      let!(:credit_rate_2) { create(:company_credit_rate, value: 2, created_at: DateTime.new(2010, 1, 2, 0, 0)) }
      let!(:credit_rate_3) { create(:company_credit_rate, value: 3, created_at: DateTime.new(2010, 1, 3, 0, 0)) }

      let!(:credit_rate_4) { create(:company_credit_rate, value: 4, created_at: DateTime.new(2010, 2, 1, 0, 0)) }
      let!(:credit_rate_5) { create(:company_credit_rate, value: 5, created_at: DateTime.new(2010, 2, 2, 0, 0)) }
      let!(:credit_rate_6) { create(:company_credit_rate, value: 6, created_at: DateTime.new(2010, 2, 3, 0, 0)) }

      describe 'month' do
        let(:query_params) { { group: 'month', value: 'all' } }
        let(:values) do
          [
            { date: DateTime.new(2010, 1, 1, 0, 0), value: 2 },
            { date: DateTime.new(2010, 2, 1, 0, 0), value: 5 }
          ]
        end

        it { is_expected.to match_array values }
      end

      describe 'date' do
        let(:query_params) { { group: 'date', value: 'all' } }
        let(:values) do
          [
            { date: DateTime.new(2010, 1, 1, 0, 0), value: 1 },
            { date: DateTime.new(2010, 1, 2, 0, 0), value: 2 },
            { date: DateTime.new(2010, 1, 3, 0, 0), value: 3 },
            { date: DateTime.new(2010, 2, 1, 0, 0), value: 4 },
            { date: DateTime.new(2010, 2, 2, 0, 0), value: 5 },
            { date: DateTime.new(2010, 2, 3, 0, 0), value: 6 }
          ]
        end

        it { is_expected.to match_array values }
      end
    end
  end
end
