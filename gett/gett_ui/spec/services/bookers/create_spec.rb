require 'rails_helper'

RSpec.describe Bookers::Create, type: :service do
  it { is_expected.to be_authorized_by(Bookers::CreatePolicy) }

  describe '#execute' do
    let(:admin)      { create :companyadmin }
    let(:passenger)  { create :passenger }
    let(:onboarding) { false }

    subject(:service) { Bookers::Create.new(params: params) }

    before { allow(service).to receive(:company).and_return(admin.company) }

    context 'with valid params' do
      let(:params) do
        {
          email:         'booker@email.com',
          first_name:    'John',
          last_name:     'Smith',
          phone:         '+3111222244',
          role_type:     'booker',
          passenger_pks: [passenger.id],
          onboarding:    onboarding
        }
      end

      it 'creates new Member' do
        expect{ service.execute }.to change(Member, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:booker) { is_expected.to be_persisted }
        its('booker.notify_with_sms') { is_expected.to be_truthy }
        its('booker.notify_with_email') { is_expected.to be_truthy }
        its(:errors) { are_expected.to be_blank }
      end

      it 'does not send invitation immediately' do
        expect{ service.execute }
          .to_not change(ActionMailer::Base.deliveries, :size)
      end

      context 'when onbarding is set to true' do
        let(:onboarding) { true }

        it 'sends invitation' do
          expect{ service.execute }
            .to change(ActionMailer::Base.deliveries, :size).by(1)
        end
      end
    end

    context 'with invalid params' do
      let(:params) { { first_name: '', role_type: 'booker' } }

      it 'does not create new Member' do
        expect{ service.execute }.not_to change(Member, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { are_expected.not_to be_empty }
      end
    end
  end
end
