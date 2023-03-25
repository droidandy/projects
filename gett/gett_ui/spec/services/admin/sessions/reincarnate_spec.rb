require 'rails_helper'

RSpec.describe Admin::Sessions::Reincarnate, type: :service do
  subject(:service) { Admin::Sessions::Reincarnate.new(params) }
  let(:admin)       { create :user, :admin }
  let(:company)     { create :company }
  let(:params)      { { company_id: company.id } }

  describe '#execute' do
    service_context { { admin: admin } }

    context 'when succeeds' do
      let(:companyadmin) { create :companyadmin, company: company }

      before do
        expect_any_instance_of(Member).to receive(:realm).and_return('realm')
        expect(JsonWebToken).to receive(:encode).with(id: admin.id, reincarnated_as: companyadmin.id).and_return('token')
        service.execute
      end

      it { is_expected.to be_success }
      its(:result) { is_expected.to eq(token: 'token', realm: 'realm') }
    end

    context 'when fails' do
      context 'when company is not active' do
        before do
          company.update(active: false)
          service.execute
        end

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq 'Company account has been deactivated' }
      end

      context 'when company has no companyadmin' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq 'Company has no admin' }
      end

      context 'when companyadmin is not active' do
        let!(:companyadmin) { create :companyadmin, company: company, active: false }

        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq 'Company admin has been deactivated' }
      end
    end

    context 'for customer_care role' do
      let(:admin)   { create :user, :customer_care }
      let(:company) { create :company, customer_care_password: 'password' }
      let!(:companyadmin) { create :companyadmin, company: company }

      context 'with invalid password' do
        let(:params) { { company_id: company.id, password: 'invalid' } }

        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq 'Invalid password' }
      end

      context 'with valid password' do
        let(:params) { { company_id: company.id, password: 'password' } }

        before do
          expect_any_instance_of(Member).to receive(:realm).and_return('realm')
          expect(JsonWebToken).to receive(:encode).with(id: admin.id, reincarnated_as: companyadmin.id).and_return('token')
          service.execute
        end

        it { is_expected.to be_success }
        its(:result) { is_expected.to eq(token: 'token', realm: 'realm') }
      end
    end
  end
end
