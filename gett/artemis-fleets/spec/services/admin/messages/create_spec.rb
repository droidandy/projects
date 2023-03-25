RSpec.describe Admin::Messages::Create do
  describe '#execute' do
    let(:admin) { create :administrator }
    let(:context) { {admin: admin } }
    subject(:service) { described_class.new(context, { message: params }) }

    before do
      allow(Faye.messages).to receive(:notify_create_external)
    end

    context 'with valid params' do
      let(:params) {{ body: 'role' }}

      it 'creates new Message' do
        expect{ service.execute }.to change(Message, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:message) { is_expected.to be_persisted }
        its('message.body') { is_expected.to eq 'role' }
        its('message.sender_id') { is_expected.to eq admin.id }
        its('message.company_id') { is_expected.to eq nil }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) {{ body: '' }}

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
