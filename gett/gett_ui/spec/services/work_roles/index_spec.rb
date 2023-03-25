require 'rails_helper'

RSpec.describe WorkRoles::Index, type: :service do
  let(:work_role)    { create :work_role }
  let(:companyadmin) { create :companyadmin }
  subject(:service)  { WorkRoles::Index.new }

  it { is_expected.to be_authorized_by(WorkRoles::IndexPolicy) }

  describe '#execute' do
    service_context { { member: companyadmin } }

    it { is_expected.to use_policy_scope.returning(WorkRole.dataset) }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
