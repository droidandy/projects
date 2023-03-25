require 'rails_helper'

RSpec.describe TravelRules::Form, type: :service do
  let(:company)      { create :company }
  let(:companyadmin) { create :companyadmin, company: company }
  let!(:member1)     { create :passenger, company: company, first_name: 'John' }
  let!(:member2)     { create :passenger, company: company, first_name: 'Adam' }
  let!(:department)  { create :department, company: company }
  let!(:work_role)   { create :work_role, company: company }

  subject(:service)  { TravelRules::Form.new }

  it { is_expected.to be_authorized_by(TravelRules::FormPolicy) }

  describe '#execute' do
    service_context { { company: company } }

    describe 'result' do
      let(:members_json)    { [member2, member1].map{ |m| m.as_json(only: [:id, :first_name, :last_name]) } }
      let(:department_json) { department.as_json(only: [:id, :name]) }
      let(:work_role_json)  { work_role.as_json(only: [:id, :name]) }

      subject(:form_json) { service.execute.result }

      its([:members])     { is_expected.to eq members_json }
      its([:departments]) { is_expected.to eq [department_json] }
      its([:work_roles])  { is_expected.to eq [work_role_json] }

      describe '[:vehicles]' do
        # vehicles exist as part of seeds
        let(:fallback_names) { Vehicle.fallback.all.map(&:name) }

        it 'should not contain fallback vehicles' do
          expect(fallback_names).to be_present
          expect(form_json).not_to include(a_hash_including('name' => a_string_matching(/#{fallback_names.join('|')}/)))
        end
      end
    end
  end
end
