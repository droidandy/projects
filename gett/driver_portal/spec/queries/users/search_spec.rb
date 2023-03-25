require 'rails_helper'

RSpec.describe Users::Search do
  subject { described_class.new(params, current_user: create(:user, :with_site_admin_role)) }

  describe 'filter by name' do
    let(:params) do
      {
        query: 'Rick',
        category: 'name'
      }
    end

    let!(:user_1) { create(:user, :with_driver_role, first_name: 'Rick', last_name: 'Sanchez') }
    let!(:user_2) { create(:user, :with_driver_role, first_name: 'Evil', last_name: 'Rick') }
    let!(:user_3) { create(:user, :with_driver_role, first_name: 'Bird', last_name: 'Person') }

    it 'filters by category' do
      expect(subject.resolved_scope).to match_array([user_1, user_2])
    end
  end

  describe 'filter by phone' do
    let(:params) do
      {
        query: '123',
        category: 'phone'
      }
    end

    let!(:user_1) { create(:user, :with_driver_role) }
    let!(:user_2) { create(:user, :with_driver_role, phone: '+41 123 000') }
    let!(:user_3) { create(:user, :with_driver_role, gett_phone: '+41 123 000') }

    it 'filters by category' do
      expect(subject.resolved_scope).to match_array([user_2, user_3])
    end
  end

  describe 'filter drivers by role' do
    let(:params) { { role: 'apollo_driver' } }

    let!(:user_1) { create(:user, :with_driver_role) }
    let!(:user_2) { create(:user, :with_apollo_driver_role) }

    it 'filters by role' do
      expect(subject.drivers).to eq([user_2])
    end
  end

  describe 'filter drivers by assignment readiness' do
    let(:params) { { ready_for_assignment: true } }

    let!(:assigned_review) { create :review, :scheduled, :checked_in, :assigned }
    let!(:ready_reviews) { create_list :review, 2, :scheduled, :checked_in }
    let!(:appointed_review) { create :review, :scheduled }
    let!(:not_appointed_review) { create :review }

    it 'filters by readiness' do
      expect(subject.resolved_scope.count).to eq(2)
    end
  end

  describe 'filter drivers current assignment' do
    let(:agent) { create :user }
    let(:params) { { being_reviewed_by: agent.id } }

    let!(:assigned) { create :review, :scheduled, :checked_in, :assigned, agent: agent }
    let!(:assigned_in_progress) { create :review, :scheduled, :checked_in, :assigned, :started, agent: agent }
    let!(:assigned_finished) { create :review, :scheduled, :checked_in, :assigned, :finished, agent: agent }
    let!(:other_agent_review) { create :review, :scheduled, :assigned }
    let!(:not_appointed_review) { create :review }

    it 'filters by readiness' do
      expect(subject.resolved_scope.ids).to eq([assigned.driver_id, assigned_in_progress.driver_id])
    end
  end
end
