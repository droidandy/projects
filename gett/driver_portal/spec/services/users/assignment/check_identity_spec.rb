require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Users::Assignment::CheckIdentity do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }
    let(:user) { create :user, :with_driver_role }
    let(:user_id) { user.id }

    let(:params) do
      {
        user_id: user_id
      }
    end

    include_examples 'it uses policy', Users::AssignmentPolicy, :check_identity?

    context 'with review in progress' do
      let!(:review) { create :review, driver: user }

      it 'assign valid attributes' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.user.reviews.last.identity_checked_at).to be_present
      end
    end

    context 'without review in progress' do
      it 'fails' do
        expect { subject.execute! }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'with invalid user id' do
      let(:user_id) { 0 }

      it 'fails' do
        expect { subject.execute! }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
