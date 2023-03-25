require 'rails_helper'

RSpec.describe Admin::Companies::Form, type: :service do
  let(:address)       { create(:address, line: 'foo', lat: 1, lng: 2) }
  let(:legal_address) { create(:address, line: 'legal foo', lat: 1, lng: 2) }
  let(:company)       { create(:company, address_id: address.id, legal_address_id: legal_address.id) }

  let!(:references) { nil } # needed as we later create references before service execution
  let!(:admin) { create(:companyadmin, company: company) }

  before { company.reload }

  subject(:service) { described_class.new(service_attributes) }

  let(:service_attributes) { { company: company } }

  it { is_expected.to be_authorized_by(Admin::Companies::Policy) }

  describe '#execute' do
    before { service.execute }

    it { is_expected.to be_success }

    describe 'result' do
      subject(:result) { service.result.symbolize_keys }

      it { is_expected.to include(:countries, :users, :companies, :company) }

      context 'company is not present in service attributes' do
        let(:service_attributes) { { } }

        it { is_expected.to include(:countries, :users, :companies) }
      end

      describe 'company data' do
        subject(:company_data) { service.result[:company].symbolize_keys }

        it 'includes all main keys' do
          is_expected.to include(
            :id,
            :sap_id,
            :company_type,
            :active,
            :destination_required,
            :booking_reference_required,
            :booking_reference_validation,
            :default_driver_message,
            :gett_business_id,
            :ot_username,
            :ot_client_number,
            :multiple_booking,
            :payroll_required,
            :cost_centre_required,
            :customer_care_password,
            :hr_feed_enabled,
            :marketing_allowed,
            :bookings_validation_enabled,
            :name,
            :vat_number,
            :tips,
            :account_number,
            :sort_code,
            :cost_centre,
            :legal_name,
            :salesman_id,
            :account_manager_id,
            :booking_fee,
            :run_in_fee,
            :handling_fee,
            :phone_booking_fee,
            :booker_notifications,
            :cancellation_before_arrival_fee,
            :cancellation_after_arrival_fee,
            :gett_cancellation_before_arrival_fee,
            :gett_cancellation_after_arrival_fee,
            :get_e_cancellation_before_arrival_fee,
            :get_e_cancellation_after_arrival_fee,
            :linked_company_pks,
            :logo_url,
            :admin,
            :payment_options,
            :address,
            :legal_address,
            :references,
            :critical_flag_due_on,
            :critical_flag_enabled_at,
            :critical_flag_enabled_by
          )
        end

        its([:references]) { are_expected.to be_empty }

        describe 'booking references' do
          let!(:references) { create(:booking_reference, company_id: company.id) }

          subject { company_data[:references].first.symbolize_keys }

          it 'includes keys' do
            is_expected.to include(
              :id, :name, :active, :mandatory, :validation_required, :dropdown,
              :sftp_server
            )
          end
        end

        describe 'payment options' do
          subject { company_data[:payment_options].symbolize_keys }

          it 'includes keys' do
            is_expected.to include(
              :payment_types, :business_credit, :payment_terms, :invoicing_schedule,
              :split_invoice, :additional_billing_recipients, :default_payment_type,
              :business_credit_expended
            )
          end
        end
      end
    end
  end
end
