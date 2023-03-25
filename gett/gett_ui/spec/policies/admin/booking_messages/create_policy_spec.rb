require 'rails_helper'

RSpec.describe Admin::BookingMessages::CreatePolicy, type: :policy do
  let(:superadmin)    { create :user, :superadmin }
  let(:admin)         { create :user, :admin }
  let(:sales)         { create :user, :sales }
  let(:customer_care) { create :user, :customer_care }
  let(:member)        { create :admin, company: create(:company) }

  let(:booking) { build(:booking) }

  permissions :execute? do
    it { is_expected.to permit(service).for(superadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(sales) }
    it { is_expected.to permit(service).for(customer_care) }
    it { is_expected.not_to permit(service).for(member) }
  end

  def service
    Admin::BookingMessages::Create.new(booking: booking, text: 'message')
  end
end
