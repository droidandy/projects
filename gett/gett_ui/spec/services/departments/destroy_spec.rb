require 'rails_helper'

RSpec.describe Departments::Destroy, type: :service do
  let!(:department) { create(:department) }
  let(:service)     { described_class.new(department: department) }

  it { is_expected.to be_authorized_by(Departments::DestroyPolicy) }

  describe '#execute' do
    it 'destroys Department' do
      expect{ service.execute }.to change(Department, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    context 'department has associated travel rule' do
      before { create(:travel_rule, departments: [department]) }

      it 'destroys Department' do
        expect{ service.execute }.to change(Department, :count).by(-1)
      end

      it 'executes successfully' do
        expect(service.execute).to be_success
      end
    end
  end
end
