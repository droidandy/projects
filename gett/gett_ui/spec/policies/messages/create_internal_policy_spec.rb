require 'rails_helper'

RSpec.describe Messages::CreateInternalPolicy, type: :policy do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let(:admin)        { create :admin, company: company }
  let(:booker)       { create :booker, company: company }

  let(:service) { Messages::CreateInternal.new(params: {body: 'message'}) }

  permissions :execute? do
    it { is_expected.to permit(service).for(companyadmin) }
    it { is_expected.not_to permit(service).for(admin) }
    it { is_expected.not_to permit(service).for(booker) }
  end
end
