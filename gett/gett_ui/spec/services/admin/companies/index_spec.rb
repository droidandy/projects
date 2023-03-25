require 'rails_helper'

RSpec.describe Admin::Companies::Index, type: :service do
  subject(:service) { Admin::Companies::Index.new }

  it { is_expected.to be_authorized_by(Admin::Companies::IndexPolicy) }

  describe '#execute' do
    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end

    describe 'search results' do
      let!(:company_1) { create(:company, name: 'First company') }
      let!(:company_2) { create(:company, name: 'Second company') }

      it 'filters companies list' do
        service = Admin::Companies::Index.new.execute
        expect(service.result[:items].length).to eq 2
        service = Admin::Companies::Index.new(query: {search: 'First'}).execute
        expect(service.result[:items].length).to eq 1
      end
    end

    describe 'value preloading' do
      let!(:company) { create :company }
      let(:private_companies_dataset) { service.send(:companies_dataset) }

      describe ':bookings_count' do
        subject { private_companies_dataset.with_pk(company.id)[:bookings_count] }

        context 'when no company bookings exist' do
          it { is_expected.to eq 0 }
        end

        context 'when company bookings exist' do
          before { create :booking, company: company }

          it { is_expected.to eq 1 }
        end
      end

      describe ':comments_count' do
        subject { private_companies_dataset.with_pk(company.id)[:comments_count] }

        context 'when no company comments exist' do
          it { is_expected.to eq 0 }
        end

        context 'when company comments exist' do
          before { create :company_comment, company: company }
          it { is_expected.to eq 1 }
        end
      end
    end

    describe ':order' do
      subject { Admin::Companies::Index.new(query: query).execute.result[:items].map{ |i| i['id'] } }

      context 'by :name' do
        let(:query)      { {order: 'name', reverse: 'false'} }
        let!(:company_a) { create(:company, name: 'A company') }
        let!(:company_c) { create(:company, name: 'C company') }
        let!(:company_b) { create(:company, name: 'B company') }

        it { is_expected.to eq [company_a.id, company_b.id, company_c.id] }
      end
    end

    describe ':query' do
      subject(:companies) { described_class.new(query: query).execute.result[:items] }

      describe '#credit_rate_status' do
        let(:query) { { credit_rate_status: ['ok', 'bad_credit'] } }

        let!(:company_ok) { create(:company, credit_rate_status: 'ok') }
        let!(:company_bad_credit) { create(:company, credit_rate_status: 'bad_credit') }
        let!(:company_na) { create(:company, credit_rate_status: 'na') }

        let(:filtered_companies_ids) { companies.map { |c| c['id'] } }

        it { expect(filtered_companies_ids).to include(company_ok.id, company_bad_credit.id) }
        it { expect(filtered_companies_ids).not_to include(company_na.id) }
      end
    end
  end
end
