require 'rails_helper'

RSpec.describe Messages::CreateInternal, type: :service do
  it { is_expected.to be_authorized_by(Messages::CreateInternalPolicy) }

  describe '#execute' do
    let!(:companyadmin) { create :companyadmin }

    service_context { { member: companyadmin, company: companyadmin.company } }

    subject(:service) { described_class.new(params: params) }

    before do
      allow(Faye.messages).to receive(:notify_create_internal)
    end

    context 'with valid params' do
      let(:params) { { body: 'role' } }

      it 'creates new Message' do
        expect{ service.execute }.to change(Message, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:message) { is_expected.to be_persisted }
        its('message.body') { is_expected.to eq 'role' }
        its('message.sender_id') { is_expected.to eq companyadmin.id }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { body: '' } }

      it 'does not create new Message' do
        expect{ service.execute }.not_to change(Message, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
