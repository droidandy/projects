require 'rails_helper'

RSpec.describe Payment, type: :model do
  describe 'fingerprint' do
    describe 'with booking' do
      let(:booking) { create(:booking) }
      subject(:payment) { create(:payment, amount_cents: 100, booking: booking) }
      let(:hash_value) { "100:#{booking.id}:" }

      its(:fingerprint) { is_expected.to eq(Digest::MD5.hexdigest(hash_value)) }
    end

    describe 'with invoices' do
      let(:invoices) { create_list(:invoice, 2) }
      subject(:payment) { create(:payment, amount_cents: 200, booking: nil, invoice_pks: invoices.map(&:id)) }
      let(:hash_value) { "200::#{invoices.first.id}:#{invoices.last.id}" }

      its(:fingerprint) { is_expected.to eq(Digest::MD5.hexdigest(hash_value)) }
    end
  end
end
