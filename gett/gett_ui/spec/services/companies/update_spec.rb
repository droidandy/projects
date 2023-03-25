require 'rails_helper'

RSpec.describe Companies::Update, type: :service do
  it { is_expected.to be_authorized_by(Companies::UpdatePolicy) }

  describe '#execute' do
    let(:company)     { create :company }
    subject(:service) { Companies::Update.new(params: params) }

    service_context { { company: company } }

    context 'with valid params' do
      let(:params) { company.values.except(:id).merge(logo: 'changed') }

      it 'updates company' do
        expect{ service.execute }.to change{ company.reload.logo }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end
  end
end
