require 'rails_helper'

RSpec.describe Admin::Members::Index, type: :service do
  it { is_expected.to be_authorized_by(Admin::Policy) }

  let(:company)         { create(:company, name: 'Jupiter Mining Corporation') }
  let!(:member_blake)   { create(:booker, company: company, first_name: 'Blake', last_name: 'Jackson', email: 'blake@jmc.com') }
  let!(:member_sarah)   { create(:booker, company: company, first_name: 'Sarah', last_name: 'Jacksonville', email: 'sarah@jmc.com') }
  let!(:member_connor)  { create(:booker, company: company, first_name: 'Sarah', last_name: 'Connor', email: 'sarah@roccat.com') }
  let(:admin)           { create(:user, :admin) }

  service_context { { user: admin } }
  subject(:service) { Admin::Members::Index.new(query: query) }

  let(:query) { {page: 1} }

  describe '#execute' do
    before { service.execute }

    it { is_expected.to be_success }

    describe 'execution result' do
      subject { service.result }

      it { is_expected.to include(:items, :pagination) }

      its([:items]) { are_expected.to_not be_empty }

      describe 'items' do
        subject(:row) { service.result[:items].first }

        it 'includes all needed columns' do
          expect(row).to include(
            :id,
            :email,
            :first_name,
            :last_name,
            :company_name,
            :company_type,
            :member_role_name,
            :comments_count,
            :last_logged_in_at,
            :login_count,
            :vip,
            :avatar_url
          )
        end
      end

      describe 'querying' do
        describe 'search' do
          let(:query)   { {page: 1, search: search} }

          context "when :search is 'Full Name'" do
            let(:search) { 'Sarah Jack' }

            its([:items]) { are_expected.to include(hash_including(id: member_sarah.id)) }

            its([:items]) { are_expected.to_not include(hash_including(id: member_blake.id)) }
            its([:items]) { are_expected.to_not include(hash_including(id: member_connor.id)) }
          end

          context "when :search is 'First Name'" do
            let(:search) { 'Sarah' }

            its([:items]) { are_expected.to include(hash_including(id: member_sarah.id)) }
            its([:items]) { are_expected.to include(hash_including(id: member_connor.id)) }

            its([:items]) { are_expected.to_not include(hash_including(id: member_blake.id)) }
          end

          context "when :search is 'Last Name'" do
            let(:search) { 'Jack' }

            its([:items]) { are_expected.to include(hash_including(id: member_sarah.id)) }
            its([:items]) { are_expected.to include(hash_including(id: member_blake.id)) }

            its([:items]) { are_expected.to_not include(hash_including(id: member_connor.id)) }
          end

          context "when :search is 'Email'" do
            let(:search) { 'blake@jmc' }

            its([:items]) { are_expected.to include(hash_including(id: member_blake.id)) }

            its([:items]) { are_expected.to_not include(hash_including(id: member_connor.id)) }
            its([:items]) { are_expected.to_not include(hash_including(id: member_sarah.id)) }
          end

          context "when :search is 'Company Name'" do
            let(:search) { 'jupiter' }

            its([:items]) { are_expected.to include(hash_including(id: member_blake.id)) }
            its([:items]) { are_expected.to include(hash_including(id: member_sarah.id)) }
            its([:items]) { are_expected.to include(hash_including(id: member_connor.id)) }
          end
        end
      end
    end
  end

  describe 'ordering' do
    subject { -> { Admin::Members::Index.new(query: query.merge(page: 1)).execute } }

    %w'id firstName lastName email companyName companyType lastLoggedInAt loginCount'.each do |column|
      context "order_by #{column}" do
        let(:query) { {order: column} }

        it { is_expected.not_to raise_error }
      end
    end
  end
end
