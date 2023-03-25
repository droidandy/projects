require 'rails_helper'

RSpec.describe CompanySettings::ShowPolicy, type: :policy do
  let(:company)   { create :company }
  let(:admin)     { create :admin, company: company }
  let(:booker)    { create :booker, company: company }
  let(:passenger) { create :passenger, company: company }

  let(:service) { CompanySettings::Show.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :edit? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :see_sftp_options? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end
end
