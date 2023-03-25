require 'rails_helper'

RSpec.describe Admin::Ddis::FetchPredefinedOrCreateCustom, type: :service do
  describe '#execute' do
    let(:company)   { create(:company) }
    let(:ddi)       { company.ddi }
    let!(:ddi_mega) { create(:ddi, :mega) }
    let(:phone)     { '' }
    let(:service)   { Admin::Ddis::FetchPredefinedOrCreateCustom.new(type: type, phone: phone) }

    subject { service.execute.result.id }

    context 'custom type' do
      let(:type)  { 'custom' }
      let(:phone) { '+123654789' }

      it { is_expected.to eq(Ddi.last.id) }
    end

    context 'predefined_type type' do
      let(:type) { 'mega' }

      it { is_expected.to eq(ddi_mega.id) }
    end
  end
end
