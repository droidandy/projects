require 'rails_helper'

RSpec.describe Bookers::Update, type: :service do
  it { is_expected.to be_authorized_by(Bookers::UpdatePolicy) }

  describe '#execute' do
    let(:company) { create :company }
    let(:admin)   { create :companyadmin, company: company }
    let(:booker)  { create :booker, company: company, first_name: 'John' }

    subject(:service) { Bookers::Update.new(booker: booker, params: params) }

    service_context { { member: admin } }

    context 'with valid params' do
      let(:params) { booker.values.merge(first_name: 'changed', role_type: 'booker') }

      it 'updates booker' do
        expect{ service.execute }.to change{ booker.reload.first_name }.to('changed')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end

      describe 'send invitation' do
        context 'when onbarding is set to true' do
          let(:params) { booker.values.merge(onboarding: true) }

          it 'sends invitation' do
            expect{ service.execute }
              .to change(ActionMailer::Base.deliveries, :size).by(1)
          end
        end

        context 'when onbarding is already set' do
          let(:booker) { create :booker, company: company, onboarding: true }
          let(:params) { booker.values.merge(onboarding: true) }

          it 'does not send invitation' do
            expect{ service.execute }
              .to_not change(ActionMailer::Base.deliveries, :size)
          end
        end
      end
    end

    context 'with invalid params' do
      let(:params) { { first_name: '', role_type: 'booker' } }

      it 'does not update booker' do
        expect{ service.execute }.not_to change{ booker.reload.first_name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
