require 'rails_helper'

RSpec.describe Admin::Companies::Destroy, type: :service do
  it { is_expected.to be_authorized_by(Admin::Companies::DestroyPolicy) }

  let!(:company) { create :company }

  subject(:service) { Admin::Companies::Destroy.new(company: company) }

  describe '#execute' do
    let!(:admin)     { create :companyadmin, company: company }
    let!(:booker)    { create :booker, company: company }
    let!(:passenger) { create :passenger, company: company, booker_pks: [booker.id] }

    before do
      contact = create(:contact, company_id: company.id)
      company.company_info.update(contact: contact)
      create :contact, :billing, company_id: company.id
      create :location, company: company
      create :work_role, company: company
      create :department, company: company
      create :travel_reason, company: company
      create :travel_rule, company: company, members: [passenger]
      create :payment_card, :company, company: company
      create :message, company: company, sender: admin
      create :passenger_address, :home, passenger: passenger
      create :passenger_address, :work, passenger: passenger
      create :passenger_address, :favorite, passenger: passenger
      create :payment_card, :personal, passenger: passenger
    end

    it 'destroys Company' do
      expect{ service.execute }.to change_counts_by(
        Company => -1,
        CompanyInfo => -1,
        PaymentOptions => -1,
        Contact => -2,
        Location => -1,
        WorkRole => -1,
        Department => -1,
        TravelReason => -1,
        TravelRule => -1,
        Member => -3,
        PassengerAddress => -3,
        PaymentCard => -2,
        Message => -1
      )
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    context 'company with orders' do
      let(:booker)   { create :member, company: company }
      let!(:booking) { create :booking, booker: booker }

      it 'does not destroy Company' do
        expect{ service.execute }.not_to change(Company, :count)
      end

      it 'does not execute successfully' do
        expect(service.execute).not_to be_success
      end
    end
  end
end
