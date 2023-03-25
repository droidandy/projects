require 'rails_helper'

RSpec.describe Admin::Companies::UpdateDdi, type: :service do
  describe '#execute' do
    let!(:ddi_standard) { create(:ddi, phone: '123') }
    let!(:ddi_mega)     { create(:ddi, :mega, phone: '124') }
    let(:params)        { {type: type, phone: phone} }
    let(:phone)         { '' }

    subject(:service) { Admin::Companies::UpdateDdi.new(company: company, params: params) }

    context 'company has custom ddi' do
      let(:ddi)     { create(:ddi, :custom, phone: '221') }
      let(:company) { create(:company, ddi: ddi) }

      describe 'change custom ddi number' do
        let(:type)  { 'custom' }
        let(:phone) { '222' }

        specify do
          expect{ service.execute }.to change{ company.ddi.reload.phone }.from('221').to('222')
          expect{ service.execute }.to_not change{ company.ddi.reload }
        end
      end

      describe "doesn't change ddi custom number" do
        let(:type)  { 'custom' }
        let(:phone) { '221' }

        specify do
          expect{ service.execute }.to_not change{ company.ddi.reload.phone }
        end
      end

      describe 'change to mega ddi type' do
        let(:type) { 'mega' }

        specify { expect{ service.execute }.to change{ company.ddi.reload }.to(ddi_mega) }
      end
    end

    context 'company has standard ddi' do
      let(:company) { create :company, ddi: ddi_standard }

      describe 'change to custom ddi' do
        let(:type)  { 'custom' }
        let(:phone) { '222' }

        specify { expect{ service.execute }.to change{ company.ddi.reload }.from(ddi_standard) }
      end

      describe "doesn't change standard ddi" do
        let(:type) { 'standard' }

        specify { expect{ service.execute }.to_not change{ company.ddi.reload } }
      end

      describe 'change to mega ddi type' do
        let(:type) { 'mega' }

        specify { expect{ service.execute }.to change{ company.ddi.reload }.to(ddi_mega) }
      end
    end
  end
end
