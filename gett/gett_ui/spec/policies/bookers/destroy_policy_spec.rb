require 'rails_helper'

RSpec.describe Bookers::DestroyPolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }
  let(:passenger)    { create :passenger, company: company }

  let(:companyadmin_service) { service_for companyadmin }
  let(:admin_service)        { service_for admin }
  let(:booker_service)       { service_for booker }

  permissions :execute? do
    it { is_expected.not_to permit(companyadmin_service).for(companyadmin) }
    it { is_expected.to permit(admin_service).for(companyadmin) }
    it { is_expected.to permit(booker_service).for(companyadmin) }

    it { is_expected.not_to permit(companyadmin_service).for(admin) }
    it { is_expected.to permit(admin_service).for(admin) }
    it { is_expected.to permit(booker_service).for(admin) }

    it { is_expected.not_to permit(companyadmin_service).for(booker) }
    it { is_expected.not_to permit(admin_service).for(booker) }
    it { is_expected.not_to permit(booker_service).for(booker) }

    it { is_expected.not_to permit(companyadmin_service).for(passenger) }
    it { is_expected.not_to permit(admin_service).for(passenger) }
    it { is_expected.not_to permit(booker_service).for(passenger) }
  end

  def service_for(booker)
    Bookers::Destroy.new(booker: booker)
  end
end
