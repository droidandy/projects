require 'rails_helper'

RSpec.describe External::Bookings::Index, type: :service do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }

  service_context { {member: admin, company: company} }

  describe '#execute' do
    subject(:service) { described_class.new }

    describe 'execution result' do
      subject { service.execute.result }

      it { is_expected.to include(:items) }
    end
  end
end
