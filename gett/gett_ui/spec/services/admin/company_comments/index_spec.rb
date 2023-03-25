require 'rails_helper'

RSpec.describe Admin::CompanyComments::Index, type: :service do
  describe '#execute' do
    let(:admin)     { create :user, :admin }
    let(:company)   { create :company }
    let!(:comments) { create_list :company_comment, 2, company: company }

    subject(:service) { Admin::CompanyComments::Index.new(company: company).execute }

    it { is_expected.to be_success }

    describe 'result' do
      let(:items) { service.result[:items] }

      it 'contains company comments' do
        expect(items.map{ |i| i['id'] }).to match_array(comments.map(&:id))
      end
    end
  end
end
