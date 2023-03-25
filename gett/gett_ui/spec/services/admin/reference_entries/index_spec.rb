require 'rails_helper'

RSpec.describe Admin::ReferenceEntries::Index, type: :service do
  let(:booking_reference) { create :booking_reference }
  let!(:reference_entry_list) { reference_entries }

  subject(:service) do
    Admin::ReferenceEntries::Index.new(query: {
      booking_reference_id: booking_reference.id,
      search_term: 'hel'
    })
  end

  describe '#execute' do
    before do
      stub_const('Shared::ReferenceEntries::Index::MAX_AMOUNT', 5)
      service.execute
    end

    context 'when no results are available' do
      let(:reference_entries) { nil }

      it { is_expected.to be_success }

      its(:result) { is_expected.to eq(items: []) }
    end

    context 'when results are available' do
      let(:reference_entries) { [match, other] }
      let(:match) { create :reference_entry, value: 'Hello', booking_reference: booking_reference }
      let(:other) { create :reference_entry, value: 'Hey', booking_reference: booking_reference }

      its(:result) do
        is_expected.to eq(items: [
          { id: match.id, booking_reference_id: match.booking_reference_id, value: 'Hello' }
        ])
      end
    end

    context 'when limit is reached' do
      let(:reference_entries) { create_list :reference_entry, 6, value: 'hel', booking_reference: booking_reference }

      it { expect(service.result[:items].count).to eq 5 }
    end
  end
end
