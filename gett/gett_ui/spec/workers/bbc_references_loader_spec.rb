require 'rails_helper'

RSpec.describe BbcReferencesLoader, type: :worker do
  subject(:worker) { described_class.new }

  describe '#perform' do
    let!(:company) { create(:company, :bbc) }
    let!(:reference) { create(:booking_reference, company: company, priority: 0) }
    let(:stub_data) { %w(1 2 3) }

    before do
      allow(Sequel).to receive(:connect)
        .with(Settings.ot_charges_db.to_h)
        .and_return(stub_data)
    end

    it 'loads values into first booking reference' do
      expect{ worker.perform }.to change(ReferenceEntry, :count).by(stub_data.count)
      expect(reference.reference_entries.pluck(:value)).to match_array(stub_data)
    end

    context 'company is not BBC' do
      let!(:company) { create(:company) }

      it 'does not upload references' do
        expect{ worker.perform }.to_not change(ReferenceEntry, :count)
      end
    end

    context 'company is inactive' do
      let!(:company) { create(:company, :bbc, active: false) }

      it 'does not upload references' do
        expect{ worker.perform }.to_not change(ReferenceEntry, :count)
      end
    end

    context 'reference entries present' do
      before do
        create(:reference_entry, booking_reference: reference)
      end

      it 'replaces reference entries' do
        expect{ worker.perform }.to change(ReferenceEntry, :count).from(1).to(stub_data.count)
      end
    end
  end
end
