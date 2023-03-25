require 'rails_helper'

RSpec.describe Bookings::Index, type: :service do
  it { is_expected.to be_authorized_by(Bookings::IndexPolicy) }

  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }

  service_context { { member: admin, company: company } }

  describe '#execute' do
    subject(:service) { Bookings::Index.new(query: query) }

    let(:query) { nil }

    it { is_expected.to use_policy_scope }

    describe 'execution result' do
      subject(:result) { service.execute.result }

      it { is_expected.to include(:items) }

      describe 'pagination' do
        before { create(:booking, company: company) }

        context 'when a particular page is requested' do
          let(:query) { {page: 1} }

          it 'returns pagination information' do
            expect(result).to include(pagination: {current: 1, total: 1, page_size: 10})
          end
        end

        context 'when no page is requested' do
          it 'does not return pagination information' do
            expect(result).to_not include(:pagination)
          end
        end
      end
    end
  end
end
