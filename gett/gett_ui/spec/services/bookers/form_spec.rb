require 'rails_helper'

RSpec.describe Bookers::Form, type: :service do
  it { is_expected.to be_authorized_by(Bookers::FormPolicy) }

  describe '#execute' do
    let(:admin) { create :admin }

    subject(:service) { Bookers::Form.new }

    service_context { { member: admin, company: admin.company } }

    describe 'execution result' do
      subject { service.execute.result }

      it { is_expected.to include :passengers, :work_roles, :departments }
      its([:can]) { is_expected.to include :change_role, :change_active, :assign_passengers }
    end
  end
end
