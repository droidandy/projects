require 'rails_helper'

RSpec.describe Admin::Ddis::UpdatePredefined, type: :service do
  describe '#execute' do
    let!(:ddi_mega)   { create(:ddi, :mega, phone: '123') }
    let!(:ddi_key)    { create(:ddi, :key) }
    let!(:ddi_custom) { create(:ddi, :custom) }

    subject(:service) { Admin::Ddis::UpdatePredefined.new(type: type, phone: phone) }

    context "doesn't change custom ddi phone" do
      let(:type)  { 'custom' }
      let(:phone) { '124' }

      it { expect{ service.execute }.not_to change{ ddi_custom.reload.phone } }
    end

    context 'changes mega ddi phone' do
      let(:type)  { 'mega' }
      let(:phone) { '124' }

      it { expect{ service.execute }.to change{ ddi_mega.reload.phone }.from('123').to('124') }
    end
  end
end
