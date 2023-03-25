require 'rails_helper'

RSpec.describe Invoices::Index, type: :service do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }

  subject(:service) { described_class.new }

  service_context { { company: company } }

  it { is_expected.to be_authorized_by(Invoices::IndexPolicy) }

  describe 'result' do
    describe 'transaction history' do
      subject(:transaction_history) { service.execute.result[:transaction_history] }

      context 'no paid invoices' do
        it 'returns empty history' do
          expect(transaction_history).to be_empty
        end
      end

      context 'with paid invoices' do
        describe 'history items' do
          let!(:invoice) do
            create(:invoice, company: company, paid_at: Time.current, paid_amount_cents: 1050, amount_cents: 1050)
          end

          it 'returns history' do
            expect(transaction_history).to eq([{
              name: invoice.created_at.strftime('%b'),
              value: 10.5
            }])
          end
        end

        describe 'history items order' do
          before do
            Timecop.freeze '2017-03-02'
            13.times do
              create(:invoice, :paid, company: company, amount_cents: 100)
              Timecop.travel 1.month.from_now
            end
          end

          after { Timecop.return }

          it 'has history items in proper order for last year' do
            expect(transaction_history.map{ |item| item[:name] })
              .to eq(%w'Apr May Jun Jul Aug Sep Oct Nov Dec Jan Feb Mar')
          end

          it "doesn't sum amounts for same-named months" do
            expect(transaction_history[-1][:value]).to eq(1.0)
          end
        end
      end
    end

    describe 'items' do
      subject(:items) { service.execute.result[:items] }

      context 'when there are no invoices' do
        it { is_expected.to be_empty }
      end

      context 'when invoices have been generated' do
        let!(:invoice1) do
          create(:invoice, company: company, amount_cents: 1050, created_at: 0.months.ago)
        end
        let!(:invoice2) do
          create(:invoice, company: company, amount_cents: 1050, created_at: 1.month.ago)
        end

        its(:count) { is_expected.to eq(2) }

        it 'returns invoices in the correct order' do
          expect(items[0]['id']).to eq(invoice1.id)
          expect(items[1]['id']).to eq(invoice2.id)
        end
      end
    end

    describe 'company_payment_types' do
      subject(:company_payment_types) { service.execute.result[:company_payment_types] }

      it { is_expected.to eq ['account'] }
    end
  end
end
