require 'rails_helper'

describe Bookers::Query, type: :service do
  let(:company) { create(:company) }
  let(:scope)   { company.bookers_dataset }

  let!(:finance_members) { create_list(:finance, 5, company: company) }
  let!(:booker_members)  { create_list(:booker, 6, company: company) }

  subject(:dataset) { Bookers::Query.new(query_params, scope: scope).resolved_scope }

  describe 'query_by(:page)' do
    let(:query_params) { { page: 1 } }

    it 'paginates records correctly' do
      expect(dataset.page_count).to eq 2
      expect(dataset.pagination_record_count).to eq 11
    end

    context 'when filters are active' do
      let(:query_params) { { page: 1, role: ['finance'] } }

      it 'paginates records after filtering' do
        expect(dataset.page_count).to eq 1
        expect(dataset.pagination_record_count).to eq 5
      end
    end
  end

  describe 'query_by(:role)' do
    context 'when requesting finance members' do
      let(:query_params) { { role: ['finance'] } }

      it 'filters correctly' do
        expect(dataset.all).to eq finance_members
      end
    end

    context 'when requesting bookers members' do
      let(:query_params) { { role: ['booker'] } }

      it 'filters correctly' do
        expect(dataset.all).to eq booker_members
      end
    end
  end
end
