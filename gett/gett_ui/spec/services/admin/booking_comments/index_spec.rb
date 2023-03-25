require 'rails_helper'

RSpec.describe Admin::BookingComments::Index, type: :service do
  describe '#execute' do
    let(:admin)     { create :user, :admin }
    let(:booking)   { create :booking }
    let!(:comments) { create_list :booking_comment, 2, booking: booking }

    subject(:service) { Admin::BookingComments::Index.new(booking: booking).execute }

    it { is_expected.to be_success }

    describe 'result' do
      let(:items) { service.result[:items] }

      it 'contains booking comments' do
        expect(items.map{ |i| i['id'] }).to match_array(comments.map(&:id))
      end
    end
  end
end
