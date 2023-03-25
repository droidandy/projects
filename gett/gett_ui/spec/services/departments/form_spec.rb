require 'rails_helper'

RSpec.describe Departments::Form, type: :service do
  let(:companyadmin) { create :companyadmin }

  subject(:service) { Departments::Form.new }

  it { is_expected.to be_authorized_by(Departments::FormPolicy) }

  describe '#execute' do
    service_context { { company: companyadmin.company, user: companyadmin } }

    subject(:result) { service.execute.result }

    it { is_expected.to include :members }
  end
end
