require 'rails_helper'

RSpec.describe DirectDebitMandates::Create, type: :service do
  let(:company) { create(:company) }
  let(:companyadmin) { create(:companyadmin, company: company) }
  service_context { { company: company, member: companyadmin } }
  subject(:service) { DirectDebitMandates::Create.new }

  it { is_expected.to be_authorized_by(DirectDebitMandates::Policy) }

  describe '#execute' do
    context 'an active mandate exists' do
      before do
        create(:direct_debit_mandate, :active, company: company)
        service.execute
      end

      it { is_expected.not_to be_success }
    end

    context 'no active mandate' do
      before do
        client = double('GoCardlessPro::Client')
        expect(GoCardlessClientBuilder).to receive(:build).and_return(client)
        expect(client).to receive(:redirect_flows).and_return(client)
        expect(client).to receive(:create).and_return(client)
        expect(client).to receive(:redirect_url).and_return('redirect_url')
        expect(client).to receive(:id).and_return('flow_id')

        service.execute
      end

      it { is_expected.to be_success }

      it 'creates a mandate and initates a redirect flow' do
        expect(service.result).to eq 'redirect_url'

        mandate = company.direct_debit_mandate
        expect(mandate.go_cardless_redirect_flow_id).to eq 'flow_id'
        expect(mandate.created_by).to eq companyadmin
        expect(mandate.status).to eq(DirectDebitMandate::INITIATED)
      end
    end
  end
end
