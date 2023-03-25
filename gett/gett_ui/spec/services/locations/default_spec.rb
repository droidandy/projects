require 'rails_helper'

RSpec.describe Locations::Default, type: :service do
  it { is_expected.to be_authorized_by(Locations::Policy) }

  describe '#execute' do
    let(:company)          { create :company }
    let(:companyadmin)     { create :companyadmin, company: company }
    let(:location)         { create :location, company: company }
    let(:default_location) { create :location, :default, company: company }

    service_context { { member: companyadmin, company: company } }

    subject(:service) { described_class.new(location: location) }

    context 'with valid params' do
      context 'location is not default' do
        it 'sets location#default to true' do
          expect{ service.execute }.to change{ location.reload.default }.to(true)
        end

        it 'sets default_location#default to false' do
          expect{ service.execute }.to change{ default_location.reload.default }.to(false)
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:location) { is_expected.to be_persisted }
          its(:errors) { is_expected.to be_blank }
        end
      end

      context 'location is already default' do
        let(:location) { default_location }

        it 'sets default_location#default to false' do
          expect{ service.execute }.to change{ location.reload.default }.to(false)
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:location) { is_expected.to be_persisted }
          its(:errors) { is_expected.to be_blank }
        end
      end
    end
  end
end
