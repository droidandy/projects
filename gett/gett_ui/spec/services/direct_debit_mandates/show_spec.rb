require 'rails_helper'

RSpec.describe DirectDebitMandates::Show, type: :service do
  let(:company) { create(:company) }
  let(:companyadmin) { create(:companyadmin, company: company) }
  service_context { { company: company, member: companyadmin } }
  subject(:service) { DirectDebitMandates::Show.new }
  let!(:mandate) { create(:direct_debit_mandate, company: company) }

  it { is_expected.to be_authorized_by(DirectDebitMandates::Policy) }

  describe '#execute' do
    before { service.execute }

    it { is_expected.to be_success }

    its(:result) { is_expected.to eq mandate }
  end
end
