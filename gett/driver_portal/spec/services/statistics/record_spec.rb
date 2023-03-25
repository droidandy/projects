require 'rails_helper'

RSpec.describe Statistics::Record do
  describe '#execute!' do
    let(:date) { '2017-12-03' }
    let(:params) { { type: type } }
    let(:login_count) { 4 }
    let(:users_count) { 2 }
    let(:entry) { create :statistics_entry, date: date, active_users: users_count, login_count: login_count }
    let!(:invites) { create_list :invite, 2, :accepted, accepted_at: Date.parse(date) + 1.hour }
    let(:logins) { create_list :login, login_count }
    let(:current_user) { system_user }

    subject { described_class.new(current_user, params) }

    before(:each) do |example|
      entry if example.metadata[:entry]
      Timecop.freeze(Date.parse(date)) do
        logins
        subject.execute!
      end
    end

    context 'with active users type' do
      let(:type) { :active_users }

      it 'creates entry with valid data' do
        expect(subject).to be_success
        expect(subject.entry.date.to_s).to eq(date)
        expect(subject.entry.active_users).to eq(users_count)
        expect(subject.entry.login_count).to eq(login_count)
      end

      context 'when entry already exist', entry: true do
        it 'increments counter' do
          expect(subject).to be_success
          expect(subject.entry.active_users).to eq(users_count + 1)
          expect(subject.entry.login_count).to eq(login_count)
        end
      end
    end

    context 'with login count type' do
      let(:type) { :login_count }

      it 'creates entry with valid data' do
        expect(subject).to be_success
        expect(subject.entry.date.to_s).to eq(date)
        expect(subject.entry.login_count).to eq(login_count)
        expect(subject.entry.active_users).to eq(users_count)
      end

      context 'when entry already exist', entry: true do
        it 'increments counter' do
          expect(subject).to be_success
          expect(subject.entry.login_count).to eq(login_count + 1)
          expect(subject.entry.active_users).to eq(users_count)
        end
      end
    end

    context 'with wrong type' do
      let(:type) { :wrong }

      it 'fails' do
        expect(subject).not_to be_success
      end
    end
  end
end
