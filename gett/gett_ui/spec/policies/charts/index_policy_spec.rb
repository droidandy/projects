require 'rails_helper'

RSpec.describe Charts::IndexPolicy, type: :policy do
  let(:company)       { create :company }
  let(:companyadmin)  { create :companyadmin, company: company }
  let(:admin)         { create :admin, company: company }
  let(:booker)        { create :booker, company: company }
  let(:travelmanager) { create :travelmanager, company: company }
  let(:passenger)     { create :passenger, company: company }

  let(:service) { Charts::Index.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(travelmanager) }
    it { is_expected.not_to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }

    context 'when service renders data for dashboard' do
      let(:service) { Charts::Index.new(for_dashboard: true) }

      it { is_expected.to permit(service).for(companyadmin) }
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(travelmanager) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(passenger) }
    end
  end
end
