require 'rails_helper'

RSpec.describe CompanyPaymentCards::Show, type: :service do
  let(:company)       { create :company }
  let!(:payment_card) { create :payment_card, :company, company: company }
  let(:admin)         { create :admin, company: company }

  it { is_expected.to be_authorized_by(CompanyPaymentCards::Policy) }

  service_context { { member: admin, company: company } }
  subject(:service) { described_class.new }

  before { service.execute }

  it { is_expected.to be_success }

  describe 'result' do
    subject { service.result }

    its(:keys) do
      is_expected.to match_array(
        %w(expiration_month expiration_year holder_name last_4)
      )
    end
  end
end
