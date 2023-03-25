RSpec.describe Messages::Create do
  describe '#execute' do
    let!(:user) { create :member }

    let(:context) do
      { user: user, company: user.company }
    end

    subject(:service) { described_class.new(context, {message: params}) }

    before do
      allow(Faye.messages).to receive(:notify_create_internal)
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
        its('message.sender_id') { is_expected.to eq user.id }
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
