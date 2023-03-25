require 'rails_helper'

RSpec.describe Admin::Users::Index, type: :service do
  let(:admin) { create(:user, :admin) }

  service_context { { user: admin } }

  subject(:service) { Admin::Users::Index.new(query: query) }

  let(:query) { {page: 1} }

  describe '#execute' do
    before { service.execute }

    it { is_expected.to be_success }

    describe 'execution result' do
      subject { service.result }

      it { is_expected.to include(:items, :pagination) }

      its([:items]) { are_expected.to_not be_empty }

      describe 'items' do
        subject { service.result[:items].first }

        it do
          is_expected.to include(
            :first_name,
            :last_name,
            :email
          )
        end
      end

      describe 'querying' do
        describe 'search' do
          let(:query)   { {page: 1, search: search} }
          let!(:admin)  { create(:user, :admin, first_name: 'Sofia', last_name: 'Asistores') }

          context "when :search is 'Full Name'" do
            let(:search) { 'Sofia Asistores' }

            its([:items]) { are_expected.to include(hash_including(first_name: admin.first_name)) }
          end
        end
      end
    end
  end
end
