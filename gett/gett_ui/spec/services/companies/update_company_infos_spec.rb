require 'rails_helper'

RSpec.describe Companies::UpdateCompanyInfos, type: :service do
  let!(:unused_company_info) { create(:company_info, international_booking_fee: 15.0) }
  let(:company_with_booking) { create(:company, international_booking_fee: 15.0) }
  let!(:used_company_info)   { company_with_booking.company_info }
  let(:booker)               { create(:booker, company: company_with_booking) }

  before { create(:booking, booker: booker) }

  let(:service) { described_class.new(params: {international_booking_fee: 25.0}) }

  it 'updates unused company_infos' do
    expect{ service.execute }
      .to change{ unused_company_info.reload.international_booking_fee }.to(25.0)
  end

  it 'supersedes used company_infos' do
    expect{ service.execute }
      .to change(CompanyInfo, :count).by(1)
      .and change{ company_with_booking.reload.international_booking_fee }.from(15.0).to(25.0)

    expect(used_company_info.reload.international_booking_fee).to eq(15.0)
  end

  it 'results in total amount of updated company_infos' do
    expect(service.execute.result).to eq(2)
  end
end
