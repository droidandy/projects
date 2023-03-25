require 'rails_helper'

RSpec.describe Admin::PredefinedAddresses::Update, type: :service do
  describe '#execute' do
    let(:predefined_address) { create :predefined_address }

    subject(:service) { Admin::PredefinedAddresses::Update.new(predefined_address: predefined_address, params: params) }

    context 'with valid params' do
      let(:params) { { line: 'new name' } }

      it 'updates PredefinedAddress' do
        expect{ service.execute }.to change{ predefined_address.reload.line }.to('new name')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:predefined_address) { is_expected.to be_persisted }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { line: '' } }

      it 'does not update PredefinedAddress' do
        expect{ service.execute }.not_to change{ predefined_address.reload.line }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
