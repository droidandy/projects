require 'rails_helper'

RSpec.describe Members::InviteAll, type: :service do
  let(:company)  { create(:company, :with_contact) }
  let!(:members) { create_list(:passenger, 2, company: company, onboarding: nil, last_logged_in_at: nil) }

  in_background do
    stub_channelling!

    let(:background_attrs) { {company_id: company.id} }
    subject { service }

    describe 'execution' do
      before { service.execute }

      it { is_expected.to be_success }
      it { is_expected.to be_authorized_by(Members::InviteAllPolicy) }

      describe 'results' do
        subject { service.result }

        let(:result) { { total_members_count: 2, invited_members_count: 2 } }

        it { is_expected.to eq result }

        context 'with no members' do
          let(:members) { nil }
          let(:result)  { { total_members_count: 0, invited_members_count: 0 } }

          it { is_expected.to eq result }
        end

        context 'with inactive members' do
          let(:members) { create_list(:passenger, 2, company: company, onboarding: nil, active: false) }
          let(:result)  { { total_members_count: 2, invited_members_count: 0 } }

          it { is_expected.to eq result }
        end

        context 'with active but already-onboarded members' do
          let(:members) { create_list(:passenger, 2, company: company, last_logged_in_at: 2.hours.ago) }
          let(:result)  { { total_members_count: 2, invited_members_count: 0 } }

          it { is_expected.to eq result }
        end
      end
    end

    describe 'emailing users' do
      let(:service_mock) { double(:execute) }

      before do
        allow(Members::Reinvite).to receive(:new).once.and_return(service_mock).twice
        allow(service_mock).to receive(:execute).twice
      end

      it 'notifies users' do
        service.execute
      end
    end
  end
end
