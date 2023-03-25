require 'rails_helper'

RSpec.describe PaymentCards::DestroyPolicy, type: :policy do
  let(:superadmin)    { create(:user, :superadmin) }
  let(:admin)         { create(:user, :admin) }
  let(:sales)         { create(:user, :sales) }
  let(:customer_care) { create(:user, :customer_care) }
  let(:company)       { create(:company) }
  let(:companyadmin)  { create(:companyadmin, company: company) }
  let(:booker)        { create(:booker, company: company) }
  let(:member)        { create(:admin, company: company) }
  let(:payment_card)  { create(:payment_card, company: company) }

  let(:service)       { PaymentCards::Destroy.new(payment_card: payment_card) }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(member) }

    context 'when payment card is default' do
      let(:default_payment_card) { create(:payment_card, company: company, default: true) }
      let(:service)              { PaymentCards::Destroy.new(payment_card: default_payment_card) }

      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(admin) }
      it { is_expected.not_to permit(service).for(sales) }
      it { is_expected.not_to permit(service).for(customer_care) }
      it { is_expected.not_to permit(service).for(companyadmin) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(member) }
    end
  end
end
