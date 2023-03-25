require 'rails_helper'

RSpec.describe Admin::Companies::Update, type: :service do
  let(:address)       { create(:address, line: 'foo', lat: 1, lng: 2, country_code: 'GB') }
  let(:legal_address) { create(:address, line: 'legal foo', lat: 1, lng: 2, country_code: 'GB') }
  let!(:company) do
    create :company,
      name:             'Old Name',
      booking_fee:      1.5,
      address_id:       address.id,
      legal_address_id: legal_address.id,
      tips: 10,
      payment_types: ['account']
  end
  let!(:admin) { create(:companyadmin, company: company) }

  subject(:service) { described_class.new(params: params, company: company) }

  describe '#execute' do
    context 'with valid params' do
      let!(:other_company) { create(:company) }

      let(:params) do
        {
          name: 'Company',
          sap_id: 'foo bar',
          booking_fee: '2.0',
          gett_cancellation_before_arrival_fee: '10',
          gett_cancellation_after_arrival_fee: '20',
          get_e_cancellation_before_arrival_fee: '25',
          get_e_cancellation_after_arrival_fee: '50',
          cancellation_before_arrival_fee: '25',
          cancellation_after_arrival_fee: '50',
          splyt_cancellation_before_arrival_fee: '0',
          splyt_cancellation_after_arrival_fee: '50',
          carey_cancellation_before_arrival_fee: '25',
          carey_cancellation_after_arrival_fee: '50',
          address: {
            line: 'updated address',
            lat: 2,
            lng: 1,
            country_code: 'GB',
            city: 'London'
          },
          tips: 15,
          payment_options: {
            payment_types: ['account', 'cash']
          },
          admin: {
            first_name: 'Updated',
            last_name:  'Name'
          },
          ddi: {
            type: 'standard'
          },
          multiple_booking: false,
          payroll_required: true,
          cost_centre_required: true,
          customer_care_password: 'password',
          linked_company_pks: [other_company.id],
          credit_rate_registration_number: '12345',
          quote_price_increase_percentage: 30,
          quote_price_increase_pounds: 20,
          phone_booking_fee: 1.5,
          international_booking_fee: 5,
          system_fx_rate_increase_percentage: 0,
          allow_preferred_vendor: true,
          country_code: 'UA'
        }
      end

      subject { -> { service.execute.company.reload } } # execute service and reload company

      it 'updates company' do
        is_expected.to change{ company.name }.to('Company')
          .and change{ company.sap_id }.to('foo bar')
          .and change{ company.booking_fee }.to(2.0)
          .and change{ company.admin.full_name }.to('Updated Name')
          .and change{ company.company_info.tips }.to(15)
          .and change{ company.payment_options.payment_types }.to(['account', 'cash'])
          .and change{ company.address.line }.to('updated address')
          .and change{ company.legal_address }.to(nil)
          .and change{ company.multiple_booking }.to(false)
          .and change{ company.payroll_required }.to(true)
          .and change{ company.cost_centre_required }.to(true)
          .and change{ company.customer_care_password }.to('password')
          .and change{ company.linked_companies }.to([other_company])
          .and change{ company.credit_rate_registration_number }.to('12345')
          .and change{ company.quote_price_increase_percentage }.to(30)
          .and change{ company.quote_price_increase_pounds }.to(20)
          .and change{ company.international_booking_fee }.to(5)
          .and change{ company.carey_cancellation_before_arrival_fee }.to(25)
          .and change{ company.carey_cancellation_after_arrival_fee }.to(50)
          .and change{ company.country_code }.to('UA')
      end

      it 'does not create new CompanyInfo' do
        expect{ service.execute }.to change_counts_by(
          CompanyInfo => 0,
          Company => 0
        )
      end

      context 'when there are bookings related to current company info' do
        before { create :booking, company_info_id: company.company_info.id }

        it 'creates new CompanyInfo' do
          expect{ service.execute }.to change_counts_by(
            CompanyInfo => 1,
            Company => 0
          )
        end
      end

      context 'when api_enabled is true' do
        before { params[:api_enabled] = true }

        it 'creates an api key' do
          expect{ service.execute }.to change{ ApiKey.count }.by(1)
          expect(company.api_key).to be_present
        end

        context 'when an api key already exists' do
          before { ApiKey.create(user: company.admin) }

          it 'does not create an api key' do
            expect{ service.execute }.to_not change{ ApiKey.count }
            expect(company.api_key).to be_present
          end
        end
      end

      context 'when bbc company parameters changed' do
        let(:bbc_params) do
          {
            company_type: 'bbc',
            custom_attributes: {
              travel_policy_mileage_limit: 40,
              hw_deviation_distance: 10,
              p11d: 10,
              excess_cost_per_mile: 1.5
            }
          }
        end
        let(:params) { super().merge(bbc_params) }

        it 'updates bbc options' do
          is_expected.to change{ company.travel_policy_mileage_limit }.from(nil).to(40)
            .and change{ company.hw_deviation_distance }.from(nil).to(10)
            .and change{ company.p11d }.from(nil).to(10)
            .and change{ company.excess_cost_per_mile }.from(nil).to(1.5)
        end
      end
    end

    context 'with invalid params' do
      context 'when company and admin are invalid' do
        let(:params) do
          {
            name: '',
            admin: {
              first_name: ''
            },
            payment_options: {},
            address: {
              line: 'foo',
              lat: nil,
              lng: nil
            },
            ddi: {
              type: 'standard'
            }
          }
        end

        it 'does not delete legal address' do
          expect{ service.execute }.not_to change{ company.reload.legal_address }
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
          its(:errors) { is_expected.to include :name, :address, 'admin.first_name' }
        end
      end
    end
  end
end
