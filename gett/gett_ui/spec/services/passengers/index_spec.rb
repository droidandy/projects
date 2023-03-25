require 'rails_helper'

RSpec.describe Passengers::Index, type: :service do
  let(:member) { create(:booker, first_name: 'John') }

  subject(:service) { Passengers::Index.new(query: { page: 1 }) }

  it { is_expected.to be_authorized_by(Passengers::IndexPolicy) }

  describe '#execute' do
    let!(:passengers) { create_list(:passenger, 2, company: member.company, booker_pks: [member.id], last_logged_in_at: nil) }

    service_context { { member: member, company: member.company } }

    it { is_expected.to use_policy_scope.returning(Member.dataset) }

    describe 'execution' do
      before { service.execute }

      it { is_expected.to be_success }

      describe 'results' do
        subject { service.result }

        describe 'results[:items]' do
          it 'returns all members' do
            member_ids = service.result[:items].pluck('id')
            expected_ids = passengers.pluck(:id).push(member.id)
            expect(member_ids).to match_array(expected_ids)
          end
        end

        describe 'results[:pagination]' do
          it { expect(service.result[:pagination]).to eq(current: 1, total: 3) }
        end

        describe 'results[:can]' do
          let(:permissions) do
            {
              add_passenger:         false,
              have_passenger:        true,
              export_passengers:     true,
              import_passengers:     false,
              invite_all_passengers: false
            }
          end

          its([:can]) { is_expected.to eq permissions }

          context 'when user is companyadmin' do
            let(:member) { create(:companyadmin, first_name: 'John') }
            let(:permissions) do
              {
                add_passenger:         true,
                have_passenger:        true,
                export_passengers:     true,
                import_passengers:     true,
                invite_all_passengers: true
              }
            end

            its([:can]) { is_expected.to eq permissions }

            context 'when all passengers have already been invited' do
              let(:passengers) { create_list(:passenger, 2, company: member.company, last_logged_in_at: 1.hour.ago) }
              let(:permissions) do
                {
                  add_passenger:         true,
                  have_passenger:        true,
                  export_passengers:     true,
                  import_passengers:     true,
                  invite_all_passengers: false
                }
              end

              its([:can]) { is_expected.to eq permissions }
            end
          end
        end

        describe 'results[:statistics]' do
          it { expect(service.result[:statistics]).to eq(total: 3, active: 3, yet_to_invite: 2) }
        end
      end
    end
  end
end
