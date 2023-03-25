require 'rails_helper'

RSpec.describe CsvReport, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_presence :recurrence }
    it { is_expected.to validate_presence :recurrence_starts_at }
    it { is_expected.to validate_presence :recipients }
    it { is_expected.to validate_presence :headers }
    it { is_expected.to validate_unique :name } # only within each company

    describe '#validate_unique_attr_per_company' do
      let(:company) { create(:company) }
      let(:other_company) { create(:company) }

      before { create(:csv_report, company: company, name: 'john') }

      context 'with the same company' do
        subject(:csv_report) { build(:csv_report, company: company, name: 'john') }

        it { is_expected.not_to be_valid }

        it 'adds correctly-formatted error to the stack' do
          csv_report.valid?
          expect(csv_report.errors).to include(name: ['is already taken'])
        end
      end

      context 'with another company' do
        subject(:csv_report) { build(:csv_report, company: other_company, name: 'john') }

        it { is_expected.to be_valid }
      end
    end

    describe '#validate_recipients' do
      let(:csv_report) { build(:csv_report, recipients: recipients) }

      subject(:record) { csv_report }

      context 'valid recipients' do
        let(:recipients) { ' some@mail.com , other@mail.com ' }

        it { is_expected.to be_valid }
      end

      context 'invalid recipients' do
        let(:recipients) { ' some@mail.com , aaa, 123 ' }

        it { is_expected.not_to be_valid }
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :company }
  end
end
