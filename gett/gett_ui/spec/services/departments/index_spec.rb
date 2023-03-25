require 'rails_helper'

RSpec.describe Departments::Index, type: :service do
  let(:department)   { create :department }
  let(:companyadmin) { create :companyadmin }
  subject(:service)  { Departments::Index.new }

  it { is_expected.to be_authorized_by(Departments::IndexPolicy) }

  describe '#execute' do
    service_context { { member: companyadmin } }

    it { is_expected.to use_policy_scope.returning(Department.dataset) }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
