require 'rails_helper'

RSpec.describe DirectDebitMandates::Complete, type: :service do
  let(:company) { create(:company) }
  let(:companyadmin) { create(:companyadmin, company: company) }
  service_context { { company: company, member: companyadmin } }
  subject(:service) { DirectDebitMandates::Complete.new(redirect_flow_id: 'flow1') }

  it { is_expected.to be_authorized_by(DirectDebitMandates::Policy) }

  describe '#execute' do
    context 'mandate does not exits' do
      before { service.execute }

      it { is_expected.not_to be_success }
    end

    context 'a valid mandate exists' do
      let!(:mandate) do
        create(
          :direct_debit_mandate,
          company: company,
          go_cardless_redirect_flow_id: 'flow1',
          created_by: companyadmin
        )
      end

      before do
        client = double('GoCardlessPro::Client')
        expect(GoCardlessClientBuilder).to receive(:build).and_return(client)
        expect(client).to receive(:redirect_flows).and_return(client)
        expect(client).to receive(:complete).and_return(client)
        expect(client).to receive(:links).and_return(client)
        expect(client).to receive(:mandate).and_return('mandate_id')

        service.execute
      end

      it { is_expected.to be_success }

      it 'updates the mandate' do
        mandate.reload
        expect(mandate.status).to eq(DirectDebitMandate::PENDING)
        expect(mandate.go_cardless_mandate_id).to eq('mandate_id')
      end
    end

    context 'a mandate created by another user exists' do
      let!(:mandate) do
        create(:direct_debit_mandate, company: company, go_cardless_redirect_flow_id: 'flow1')
      end

      it { is_expected.not_to be_success }
    end

    context 'a mandate with a different flow id exists' do
      let!(:mandate) do
        create(:direct_debit_mandate, company: company, created_by: companyadmin)
      end

      it { is_expected.not_to be_success }
    end
  end
end
