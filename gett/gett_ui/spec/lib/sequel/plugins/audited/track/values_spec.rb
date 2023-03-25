require 'rails_helper'

RSpec.describe Sequel::Plugins::Audited, 'values' do
  before(:all) do
    DB.create_table!(:fake_values_authors) do
      primary_key :id
      String :name
      String :field
      String :field2
      String :field3
    end

    module FakeValues
      class Author < Sequel::Model(:fake_values_authors)
        plugin :audited,
          values: [:field, field3: :upcase ]
      end
    end
  end

  after(:all) do
    DB.drop_table(:fake_values_authors)
  end

  after(:each) do
    Sequel::Audited.enabled = false
  end

  let(:author)        { FakeValues::Author.create(name: 'author1', field: 'value1', field2: 'value2') }
  let(:create_author) { author } # alias for readability
  let(:audit_record)  { AuditLog.last }

  context 'call method on value' do
    let(:author) { FakeValues::Author.create(name: 'author1', field3: 'value3') }
    let(:changes) do
      {
        'values' => {
          'field3' => [nil, 'VALUE3']
        }
      }
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect{ create_author }.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(author.class.name)
      expect(audit_record.model_pk).to eq(author.id)

      expect(audit_record.model_ref).to eq(nil)
      expect(audit_record.event).to eq('create')
      expect(audit_record.version).to eq(1)
      expect(audit_record.user_id).to be_nil
      expect(audit_record.username).to eq('system')
      expect(audit_record.original_user_id).to be_nil
      expect(audit_record.original_username).to be_nil
      expect(audit_record.changed).to eq(changes)
    end
  end

  context 'create' do
    let(:changes) do
      {
        'values' => {
          'field' => [nil, 'value1']
        }
      }
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect{ create_author }.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(author.class.name)
      expect(audit_record.model_pk).to eq(author.id)

      expect(audit_record.model_ref).to eq(nil)
      expect(audit_record.event).to eq('create')
      expect(audit_record.version).to eq(1)
      expect(audit_record.user_id).to be_nil
      expect(audit_record.username).to eq('system')
      expect(audit_record.original_user_id).to be_nil
      expect(audit_record.original_username).to be_nil
      expect(audit_record.changed).to eq(changes)
    end

    context 'when object.values[:attr] does not correspond to object.column_changes[:attr]' do
      # describes the bug OU-1890 which reports 500 error when trying to create member with avatar
      # bug was found to be caused by wrong behaviour of Track::Base when dealing with carriervave uploaded images

      let(:base64_image) { File.read("./spec/fixtures/small_image.gif.urlData") }
      let(:attributes)   { attributes_for(:member, avatar: base64_image) }
      let(:audit_record) { Member.last.versions.first }

      before { Timecop.freeze(Time.current) }
      after  { Timecop.return }

      it 'successfully creates audit log' do
        Sequel::Audited.enabled = true

        expect{ Member.create(attributes) }.to change(AuditLog, :count)

        expect(audit_record.changed['values']['avatar'])
          .to eq([nil, "avatar-#{Time.current.to_i}.gif"])
      end
    end
  end

  context 'update' do
    let(:changes) do
      {
        'values' => {
          'field' => ['value1', 'newvalue']
        }
      }
    end

    before { author }

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect{ author.update(field: 'newvalue', field2: 'newvalue2') }
        .to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(author.class.name)
      expect(audit_record.model_pk).to eq(author.id)
      expect(audit_record.model_ref).to eq(nil)
      expect(audit_record.event).to eq('update')
      expect(audit_record.version).to eq(1)
      expect(audit_record.user_id).to be_nil
      expect(audit_record.username).to eq('system')
      expect(audit_record.original_user_id).to be_nil
      expect(audit_record.original_username).to be_nil
      expect(audit_record.changed).to eq(changes)
    end
  end

  context 'destroy' do
    let(:changes) do
      {
        'values' => {
          'field' => ['value1', nil]
        }
      }
    end

    before { create_author }

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect{ author.destroy }.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(author.class.name)
      expect(audit_record.model_pk).to eq(author.id)
      expect(audit_record.model_ref).to eq(nil)
      expect(audit_record.event).to eq('destroy')
      expect(audit_record.version).to eq(1)
      expect(audit_record.user_id).to be_nil
      expect(audit_record.username).to eq('system')
      expect(audit_record.original_user_id).to be_nil
      expect(audit_record.original_username).to be_nil
      expect(audit_record.changed).to eq(changes)
    end
  end
end
