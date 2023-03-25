require 'rails_helper'

RSpec.describe WorkRoles::Destroy, type: :service do
  let!(:work_role) { create(:work_role) }
  let(:service)    { described_class.new(work_role: work_role) }

  it { is_expected.to be_authorized_by(WorkRoles::DestroyPolicy) }

  describe '#execute' do
    it 'destroys Work Role' do
      expect{ service.execute }.to change(WorkRole, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    context 'Work Role has associated travel rule' do
      before { create(:travel_rule, work_roles: [work_role]) }

      it 'destroys Work Role' do
        expect{ service.execute }.to change(WorkRole, :count).by(-1)
      end

      it 'executes successfully' do
        expect(service.execute).to be_success
      end
    end
  end
end
