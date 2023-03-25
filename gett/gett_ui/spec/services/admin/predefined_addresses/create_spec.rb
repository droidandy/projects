require 'rails_helper'

RSpec.describe Admin::PredefinedAddresses::Create, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) { attributes_for(:predefined_address, line: 'Address 1') }

      it 'creates new PredefinedAddress' do
        expect{ service.execute }.to change(PredefinedAddress, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:predefined_address) { is_expected.to be_persisted }
        its('predefined_address.line') { is_expected.to eq 'Address 1' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { line: '' } }

      it 'does not create new PredefinedAddress' do
        expect{ service.execute }.not_to change(PredefinedAddress, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
