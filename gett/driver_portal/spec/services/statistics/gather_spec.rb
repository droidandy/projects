require 'rails_helper'

RSpec.describe Statistics::Gather do
  describe '#execute!' do
    let(:date) { '2017-12-03' }
    let(:params) { { date: date } }
    let(:current_user) { create(:user, :with_system_admin_role) }

    subject { described_class.new(current_user, params) }
    before(:each) do
      create_list :invite, 2, :accepted, accepted_at: Time.zone.parse('2017-12-02')
      create_list :invite, 3, :accepted, accepted_at: Time.zone.parse('2017-12-03')
      create_list :invite, 1, :accepted, accepted_at: Time.zone.parse('2017-12-04')

      create_list :login, 2, created_at: Time.zone.parse('2017-12-02')
      create_list :login, 3, created_at: Time.zone.parse('2017-12-03')
      create_list :login, 1, created_at: Time.zone.parse('2017-12-04')
    end

    it 'creates entry with valid data' do
      subject.execute!
      expect(subject).to be_success
      expect(subject.entry.active_users).to eq(5)
      expect(subject.entry.login_count).to eq(3)
    end

    context 'when entry allready exist' do
      before(:each) { create :statistics_entry, date: '2017-12-03', active_users: 0, login_count: 0 }

      it 'rewrites old entry data' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.entry.active_users).to eq(5)
        expect(subject.entry.login_count).to eq(3)
      end
    end
  end
end
