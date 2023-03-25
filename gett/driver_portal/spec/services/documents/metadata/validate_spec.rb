require 'rails_helper'

RSpec.describe Documents::Metadata::Validate do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user) }

    let(:kind) { create :documents_kind }
    let!(:fields) do
      [
        create(:documents_field, name: 'string_field', field_type: 'str', kind: kind, mandatory: true),
        create(:documents_field, name: 'date_field', field_type: 'date', kind: kind, mandatory: true),
        create(:documents_field, name: 'bool_field', field_type: 'bool', kind: kind, mandatory: true),
        create(:documents_field, name: 'date_time_field', field_type: 'date_time', kind: kind, mandatory: true),
        create(:documents_field, name: 'color_field', field_type: 'color', kind: kind, mandatory: true)
      ]
    end

    let(:metadata) do
      {
        string_field: 'My string',
        date_field: '2018-03-08',
        bool_field: false,
        date_time_field: '2018-05-30T11:02:04+00:00',
        color_field: 'red'
      }
    end

    let(:params) do
      {
        kind: kind,
        metadata: metadata
      }
    end

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'returns parsed attributes' do
      result = {
        string_field: 'My string',
        date_field: Date.parse('2018-03-08'),
        bool_field: false,
        date_time_field: Time.parse('2018-05-30T11:02:04+00:00'),
        color_field: 'red'
      }

      subject.execute!
      expect(subject.output).to eq(result)
    end

    context 'with allow_blank flag' do
      let(:params) { { kind: kind, metadata: metadata, allow_blank: true } }
      let(:metadata) { { bool_field: true } }

      it 'returns parsed attributes' do
        subject.execute!
        expect(subject.output).to eq(bool_field: true)
      end
    end

    context 'with wrong input data' do
      let(:metadata) do
        {
          string_field: nil,
          date_field: '2018-13-08',
          bool_field: 'not bool',
          date_time_field: '2018-55-30T11:02:04+00:00',
          color_field: nil
        }
      end

      it 'should fail' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.output).to eq(nil)
        expect(subject.errors.keys.count).to eq(5)
      end
    end
  end
end
