require 'rails_helper'

RSpec.describe PaymentOptions, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :company_id }
    it { is_expected.to validate_presence :payment_types }
    it { is_expected.to validate_presence :default_payment_type }
    it { is_expected.to validate_includes %w(weekly monthly), :invoicing_schedule }
    it { is_expected.to validate_includes %w(user department reference), :split_invoice }

    describe 'payment_terms validation' do
      it { is_expected.to validate_integer(:payment_terms) }

      context 'when invoicing_schedule is weekly' do
        subject { build(:payment_options, invoicing_schedule: 'weekly') }

        it { is_expected.to validate_includes([0, 7, 14, 30, 60, 90], :payment_terms) }
      end

      context 'when invoicing_schedule is monthly' do
        subject { build(:payment_options, invoicing_schedule: 'monthly') }

        it { is_expected.to validate_includes([0, 7, 14, 30, 60, 90], :payment_terms) }
      end
    end

    it 'returns errors if payment_types not uniq' do
      payment_options = build(:payment_options, payment_types: ['cash', 'cash'])
      expect(payment_options).not_to be_valid
      expect(payment_options.errors).to eq(
        payment_types: [I18n.t('payment_options.errors.should_be_uniq')]
      )
    end

    context 'when a booking was created with a payment type that is now being removed' do
      before do
        create(:booking, :account, company: payment_options.company)
        create(:booking, :personal_card, company: payment_options.company)
      end

      let(:payment_options) { create(:payment_options, payment_types: ['account', 'passenger_payment_card', 'cash']) }

      context 'when the removed type has no bookings associated with it' do
        before { payment_options.payment_types = ['account', 'passenger_payment_card'] }

        it 'allows to remove that payment type' do
          expect(payment_options).to be_valid
          expect(payment_options.errors).to be_empty
        end
      end

      context 'when the removed type has bookings associated with it' do
        before { payment_options.payment_types = ['account', 'passenger_payment_card'] }

        it 'does not allow to remove that payment type' do
          payment_options.payment_types = ['account']
          expect(payment_options).not_to be_valid
          expect(payment_options.errors).to eq(
            payment_types: [I18n.t('payment_options.errors.cannot_change_payment_type')]
          )
        end
      end
    end

    describe 'conflicting payment types' do
      it 'not valid for invoices types' do
        payment_options = build(:payment_options, payment_types: ['account', 'company_payment_card'])
        expect(payment_options).not_to be_valid
        expect(payment_options.errors).to eq(
          payment_types: [I18n.t('payment_options.errors.conflicting_payment_types')]
        )
      end

      it 'not valid for passenger payment card periodic type' do
        payment_options = build(:payment_options, payment_types: ['account', 'passenger_payment_card_periodic'])
        expect(payment_options).not_to be_valid
        expect(payment_options.errors).to eq(
          payment_types: [I18n.t('payment_options.errors.conflicting_payment_types')]
        )
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :company }
  end

  describe '#additional_billing_recipient_emails' do
    let(:options) { build(:payment_options, additional_billing_recipients: additional_billing_recipients) }

    subject { options.additional_billing_recipient_emails }

    context 'when nil' do
      let(:additional_billing_recipients) { nil }

      it { is_expected.to eq([]) }
    end

    context 'when comma-separated emails' do
      let(:additional_billing_recipients) { 'foo1@bar.com, foo2@bar.com' }

      it { is_expected.to eq(['foo1@bar.com', 'foo2@bar.com']) }
    end
  end

  context 'hooks' do
    describe 'before_update' do
      let(:company) { create :company }
      let(:business_credit_value1) { 3000 }
      let(:business_credit_value2) { 4000 }

      before { payment_options.update(business_credit: new_value) }

      context 'payment_options.business_credit = nil' do
        let!(:payment_options) { create :payment_options, company_id: company.id }
        let(:new_value) { business_credit_value1 }

        it 'sets the new business_credit value' do
          expect(payment_options.reload.business_credit).to eq business_credit_value1
        end
      end

      context 'payment_options.business_credit = 3000' do
        let!(:payment_options) do
          create(
            :payment_options, company_id: company.id, business_credit: business_credit_value1,
            business_credit_expended: business_credit_expended
          )
        end
        let(:new_value) { business_credit_value2 }

        context 'business credit is not expended' do
          let(:business_credit_expended) { false }

          it 'does not set the new business_credit value' do
            expect(payment_options.reload.business_credit).to eq business_credit_value2
          end
        end

        context 'business credit is expended' do
          let(:business_credit_expended) { true }

          it 'does not set the new business_credit value' do
            expect(payment_options.reload.business_credit).to eq business_credit_value1
          end
        end
      end
    end
  end

  describe '#with_periodic_payment_type?' do
    let(:payment_options) { build(:payment_options, payment_types: payment_types) }

    context 'payment_types includes PASSENGER_PAYMENT_CARD_PERIODIC' do
      let(:payment_types) { [PaymentOptions::PaymentType::ACCOUNT] }

      it { expect(payment_options.with_periodic_payment_type?).to be_falsey }
    end

    context 'payment_types doesnt include PASSENGER_PAYMENT_CARD_PERIODIC' do
      let(:payment_types) { [PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC] }

      it { expect(payment_options.with_periodic_payment_type?).to be_truthy }
    end
  end
end
