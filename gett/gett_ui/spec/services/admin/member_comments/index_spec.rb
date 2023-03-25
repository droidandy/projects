require 'rails_helper'

RSpec.describe Admin::MemberComments::Index, type: :service do
  describe '#execute' do
    let(:admin)     { create :user, :admin }
    let(:member)    { create :booker }
    let!(:comments) { create_list :member_comment, 2, member: member }

    subject(:service) { Admin::MemberComments::Index.new(member: member).execute }

    it { is_expected.to be_success }

    describe 'result' do
      let(:items) { service.result[:items] }

      it 'contains member comments' do
        expect(items.map{ |i| i['id'] }).to match_array(comments.map(&:id))
      end
    end
  end
end
