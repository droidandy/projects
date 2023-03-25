require 'rails_helper'

RSpec.describe Admin::Invoices::Index, type: :service do
  it { is_expected.to be_authorized_by(Admin::Invoices::IndexPolicy) }

  let(:query) { {} }
  subject(:service) { described_class.new(query: query) }

  describe '#execute' do
    describe 'items' do
      let(:item_ids) { service.execute.result[:items].map { |i| i['id'] } }

      context 'without filters' do
        before { create_list(:invoice, 3) }

        it 'returns all invoices' do
          expect(service.execute.result[:items].count).to eq(3)
        end
      end

      describe 'query_by(:company_id)' do
        let!(:invoices) { create_list(:invoice, 2) }
        let(:query) { {company_id: invoices.first.company_id} }

        it 'returns invoices of selected company' do
          expect(item_ids).to eq [invoices.first.id]
        end
      end

      describe 'query_by(:type)' do
        let!(:invoice) { create(:invoice) }
        let!(:cc_invoice) { create(:cc_invoice) }
        let!(:credit_note) { create(:credit_note) }

        context 'invoice' do
          let(:query) { { type: 'invoice' } }

          it 'returns invoices' do
            expect(item_ids).to eq [invoice.id]
          end
        end

        context 'cc_invoice' do
          let(:query) { { type: 'cc_invoice' } }

          it 'returns cc_invoices' do
            expect(item_ids).to eq [cc_invoice.id]
          end
        end

        context 'credit_note' do
          let(:query) { { type: 'credit_note' } }

          it 'returns credit_notes' do
            expect(item_ids).to eq [credit_note.id]
          end
        end
      end

      describe 'query_by(:status)' do
        let!(:outstanding_invoice) { create(:invoice, paid_amount_cents: 0, amount_cents: 10) }
        let!(:paid_invoice) { create(:invoice, paid_at: Time.current, paid_amount_cents: 10, amount_cents: 10) }
        let!(:overdue_invoice) { create(:invoice, overdue_at: 1.minute.ago, paid_amount_cents: 0, amount_cents: 10) }

        context 'paid' do
          let(:query) { {status: 'paid'} }

          it 'returns paid invoices' do
            expect(item_ids).to eq [paid_invoice.id]
          end
        end

        context 'not_paid' do
          let(:query) { {status: 'not_paid'} }

          it 'returns not_paid and overdue invoices' do
            expect(item_ids).to match_array [outstanding_invoice.id, overdue_invoice.id]
          end
        end

        context 'outstanding' do
          let(:query) { {status: 'outstanding'} }

          it 'returns outstanding and not overdue invoices' do
            expect(item_ids).to match_array [outstanding_invoice.id]
          end
        end

        context 'overdue' do
          let(:query) { {status: 'overdue'} }

          it 'returns overdue invoices' do
            expect(item_ids).to eq [overdue_invoice.id]
          end
        end
      end

      describe 'query_by(:from_date), query_by(:to_date)' do
        let!(:invoice1) { create(:invoice, created_at: 3.days.ago) }
        let!(:invoice2) { create(:invoice, created_at: 2.days.ago) }
        let!(:invoice3) { create(:invoice, created_at: 1.day.ago) }

        let(:query) { {from_date: 2.days.ago.to_s, to_date: 2.days.ago.to_s} }

        it 'returns invoices within date range' do
          expect(item_ids).to eq [invoice2.id]
        end
      end

      describe 'query_by(:overdue_by)' do
        let!(:invoice1) { create(:invoice, overdue_at: 2.days.ago) }
        let!(:invoice2) { create(:invoice, overdue_at: 1.day.ago) }

        # 'overdue by' is rounded up, so an invoice overdue by over 48 hours
        # is considered overdue by 3 days
        let(:query) { {overdue_by: 3} }

        it 'returns invoices overdue by at least 2 days' do
          expect(item_ids).to eq [invoice1.id]
        end
      end

      describe 'query_by(:invoice_id)' do
        let!(:invoices) { create_list(:invoice, 2) }
        let(:query) { {invoice_id: invoices.first.id} }

        it 'returns invoice with specified id' do
          expect(item_ids).to eq [invoices.first.id]
        end
      end
    end

    describe 'outstanding_debt' do
      let!(:outstanding_invoice) { create(:invoice, paid_amount_cents: 0, amount_cents: 300) }
      let!(:partially_paid_invoice) { create(:invoice, paid_amount_cents: 200, amount_cents: 300) }
      let!(:paid_invoice) { create(:invoice, paid_amount_cents: 300, amount_cents: 300) }

      it 'returns sum of upaid amount' do
        expect(service.execute.result[:outstanding_debt]).to eq(400)
      end
    end

    describe 'history' do
      let!(:invoice) do
        create(
          :invoice,
          amount_cents: 100,
          paid_amount_cents: 100,
          created_at: 1.month.ago,
          paid_at: Time.current
        )
      end

      it 'returns billing history' do
        expect(subject.execute.result[:history]).to eq([
          {
            name: invoice.created_at.strftime('%b'),
            total: 1.0,
            collected: 1.0
          }
        ])
      end
    end
  end
end
