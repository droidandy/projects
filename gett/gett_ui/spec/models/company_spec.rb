require 'rails_helper'

RSpec.describe Company, type: :model do
  describe 'delegations' do
    it { is_expected.to respond_to(:payment_types) }
    it { is_expected.to respond_to(:invoicing_schedule) }
    it { is_expected.to respond_to(:payment_terms) }
    it { is_expected.to respond_to(:with_periodic_payment_type?) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence :gett_business_id }
    it { is_expected.to validate_max_length 4, :booking_references }
    it { is_expected.to validate_max_length 100, :default_driver_message }

    context 'when enterprise' do
      let(:custom_attributes) { {} }

      subject { build(:company, :enterprise, custom_attributes: custom_attributes) }

      it { is_expected.to validate_presence :ot_username }
      it { is_expected.to validate_presence :ot_client_number }

      context 'when custom attrbutes present' do
        let(:custom_attributes) { { key: 'value' } }

        it { is_expected.not_to be_valid }
      end
    end

    context 'when bbc' do
      context 'custom attrbutes present' do
        let(:custom_attributes) do
          {
            travel_policy_mileage_limit: travel_policy_mileage_limit,
            hw_deviation_distance: hw_deviation_distance,
            excess_cost_per_mile: excess_cost_per_mile,
            p11d: p11d
          }
        end

        let(:travel_policy_mileage_limit) { '40' }
        let(:hw_deviation_distance) { '50' }
        let(:excess_cost_per_mile) { '1.8' }
        let(:p11d) { '15' }

        let(:hr_feed_enabled) { false }

        subject { build(:company, :bbc, hr_feed_enabled: hr_feed_enabled, custom_attributes: custom_attributes) }

        it { is_expected.to be_valid }

        context 'when required attribute' do
          context 'travel_policy_mileage_limit is blank' do
            let(:travel_policy_mileage_limit) { nil }

            it { is_expected.not_to be_valid }
          end

          context 'excess_cost_per_mile is blank' do
            let(:excess_cost_per_mile) { nil }

            it { is_expected.not_to be_valid }
          end

          context 'p11d is blank' do
            let(:p11d) { nil }

            it { is_expected.not_to be_valid }
          end
        end

        context 'with hr_feed enabled' do
          let(:hr_feed_enabled) { true }

          it { is_expected.not_to be_valid }
        end

        context 'when invalid custom attributes' do
          context 'hw_deviation_distance' do
            let(:hw_deviation_distance) { '-100' }

            it { is_expected.not_to be_valid }
          end

          context 'excess_cost_per_mile' do
            let(:excess_cost_per_mile) { '143239879875948234' }

            it { is_expected.not_to be_valid }
          end

          context 'p11d' do
            let(:p11d) { '103' }

            it { is_expected.not_to be_valid }
          end
        end
      end
    end
  end

  context 'dataset_module' do
    describe '#enterprise' do
      subject { Company.enterprise.all }

      let!(:enterprise_company) { create(:company, :enterprise) }
      let!(:affiliate_company) { create(:company, :affiliate) }

      it { is_expected.to include(enterprise_company) }
      it { is_expected.not_to include(affiliate_company) }
    end

    describe '#with_credit_rate' do
      subject { Company.with_credit_rate.all }

      let!(:with_credit_rate) { create(:company, :enterprise, credit_rate_registration_number: '1234') }
      let!(:without_credit_rate) { create(:company, :affiliate, credit_rate_registration_number: '') }

      it { is_expected.to include(with_credit_rate) }
      it { is_expected.not_to include(without_credit_rate) }
    end
  end

  describe 'associations' do
    it { is_expected.to have_one_to_many :bookers }
    it { is_expected.to have_one_to_one :payment_options }
    it { is_expected.to have_one_to_many :booking_references }
    it { is_expected.to have_one_to_one :primary_contact }
    it { is_expected.to have_one_to_one :billing_contact }
    it { is_expected.to have_one_to_many :departments }
    it { is_expected.to have_one_to_many :work_roles }
    it { is_expected.to have_one_to_many :financiers }
    it { is_expected.to have_many_to_one :ddi }
    it { is_expected.to have_many_to_many :special_requirements }
  end

  describe '#logo' do
    let(:base64_image) { File.read('./spec/fixtures/small_image.gif.urlData') }
    let(:ddi)          { create(:ddi) }
    let(:attributes)   { attributes_for(:company, logo: base64_image, ddi_id: ddi.id) }

    it 'correctly assigns logo' do
      company = Company.new(attributes).save

      expect(File.binread(company.logo.file.path)).to eq File.binread('./spec/fixtures/small_image.gif')
    end
  end

  describe '#destroyable?' do
    let(:company) { create :company }

    subject { company.destroyable? }

    context 'when no company bookings exist' do
      it { is_expected.to be true }
    end

    context 'when company bookings exist' do
      before { create :booking, company: company }

      it { is_expected.to be false }
    end

    context 'when :bookings_count value is preloaded' do
      it 'does not send :count method to the dataset' do
        expect(company).to receive(:[]).with(:bookings_count).twice.and_return(1)
        expect(company).not_to receive(:bookings_dataset)

        expect(company).not_to be_destroyable
      end
    end
  end

  describe '#human_credit_rate_status' do
    context 'na' do
      let(:company) { build(:company, :credit_rate_na) }

      it { expect(company.human_credit_rate_status).to eq 'N/A' }
    end

    context 'ok' do
      let(:company) { build(:company, :credit_rate_ok) }

      it { expect(company.human_credit_rate_status).to eq 'Ok' }
    end

    context 'bad_credit' do
      let(:company) { build(:company, :credit_rate_bad_credit) }

      it { expect(company.human_credit_rate_status).to eq 'Bad Credit' }
    end

    context 'bankruptcy' do
      let(:company) { build(:company, :credit_rate_bankruptcy) }

      it { expect(company.human_credit_rate_status).to eq 'Bankruptcy' }
    end

    context 'liquidation' do
      let(:company) { build(:company, :credit_rate_liquidation) }

      it { expect(company.human_credit_rate_status).to eq 'Liquidation' }
    end

    context 'ccj' do
      let(:company) { build(:company, :credit_rate_ccj) }

      it { expect(company.human_credit_rate_status).to eq 'CCJ' }
    end

    context 'unable_to_check' do
      let(:company) { build(:company, :credit_rate_unable_to_check) }

      it { expect(company.human_credit_rate_status).to eq 'Unable To Check' }
    end
  end

  describe '#direct_debit_set_up?' do
    subject(:company) { create(:company) }

    context 'no direct debit mandate' do
      its(:direct_debit_set_up?) { is_expected.to be_falsey }
    end

    context 'pending direct debit mandate' do
      before { create(:direct_debit_mandate, company: company) }

      its(:direct_debit_set_up?) { is_expected.to be_falsey }
    end

    context 'active direct debit mandate' do
      before { create(:direct_debit_mandate, :active, company: company) }

      its(:direct_debit_set_up?) { is_expected.to be(true) }
    end
  end

  describe '#outstanding_balance' do
    let(:company) { create(:company) }

    subject { company.outstanding_balance }

    context 'with no outstanding invoices' do
      let!(:paid_invoice) { create(:invoice, company: company, paid_amount_cents: 30, amount_cents: 30) }

      it { is_expected.to eq(0) }
    end

    context 'with outstanding invoices' do
      let!(:outstanding_invoice) { create(:invoice, company: company, paid_amount_cents: 0, amount_cents: 30) }

      it { is_expected.to eq(30) }
    end

    context 'with partially-paid invoices' do
      let!(:partially_paid_invoice) { create(:invoice, company: company, paid_amount_cents: 20, amount_cents: 30) }

      it { is_expected.to eq(10) }
    end

    context 'with credit notes' do
      let!(:credit_note) { create(:credit_note, company: company, amount_cents: 30) }

      it { is_expected.to eq(0) }
    end
  end

  describe '#service_suspended?' do
    before { Timecop.freeze(Time.current.beginning_of_month) }
    after  { Timecop.return }

    let(:company) { create(:company) }

    subject { company.service_suspended? }

    context 'company has no expired invoices' do
      let!(:invoice) { create(:invoice, :overdue, company: company) }

      it { is_expected.to be false }
    end

    context 'company has expired invoices' do
      let(:expired_overdue_date) { Date.current - Invoice::ALLOWED_OVERDUE_PERIOD - 1.day }

      context 'not under review' do
        let!(:invoice_1) { create(:invoice, company: company, overdue_at: expired_overdue_date) }
        let!(:invoice_2) { create(:invoice, company: company, overdue_at: expired_overdue_date) }

        it { is_expected.to be true }
      end

      context 'under review and not under review' do
        let!(:invoice_1) { create(:invoice, company: company, overdue_at: expired_overdue_date, under_review: true) }
        let!(:invoice_2) { create(:invoice, company: company, overdue_at: expired_overdue_date) }

        it { is_expected.to be true }
      end

      context 'all are under review' do
        let!(:invoice_1) { create(:invoice, company: company, overdue_at: expired_overdue_date, under_review: true) }
        let!(:invoice_2) { create(:invoice, company: company, overdue_at: expired_overdue_date, under_review: true) }

        it { is_expected.to be false }
      end
    end
  end

  describe '#special_requirements_for' do
    let(:company) { create(:company) }
    let(:special_requirement) { create(:special_requirement, :ot) }

    before do
      company.add_special_requirement(special_requirement)
    end

    context 'when :ot service type' do
      let(:service_type) { :ot }

      it 'contains ot related company reqs' do
        expect(company.special_requirements_for(service_type))
          .to contain_exactly(special_requirement.values.slice(:key, :label))
      end
    end

    context 'when not :ot service type' do
      let(:service_type) { :gett }

      it { expect(company.special_requirements_for(service_type)).not_to include(special_requirement) }

      it 'contains general special requirements' do
        special_requirements_keys = company.special_requirements_for(service_type).map { |r| r[:key] }

        expect(special_requirements_keys).to contain_exactly(*Company::GENERAL_SPECIAL_REQUIREMENTS_KEYS)
      end
    end
  end

  describe '#critical?' do
    subject{ company.critical? }

    context 'company critical flag due on is in future' do
      let(:company) { create(:company, critical_flag_due_on: Date.current.tomorrow) }

      specify { is_expected.to be true }
    end

    context 'company critical flag due on is in past' do
      let(:company) { create(:company, critical_flag_due_on: Date.current.yesterday) }

      specify { is_expected.to be false }
    end

    context 'company critical flag due on is nil' do
      let(:company) { create(:company, critical_flag_due_on: nil) }

      specify { is_expected.to be false }
    end
  end

  describe '#price_with_fx_rate_increase' do
    let(:company) { create(:company, system_fx_rate_increase_percentage: 5) }
    let(:price) { 42 }

    subject { company.price_with_fx_rate_increase(price, international: international) }

    context 'for international booking' do
      let(:expected_price) { 44 }
      let(:international) { true }

      it { is_expected.to eq expected_price }
    end

    context 'for local booking' do
      let(:expected_price) { 42 }
      let(:international) { false }

      it { is_expected.to eq expected_price }
    end
  end
end
