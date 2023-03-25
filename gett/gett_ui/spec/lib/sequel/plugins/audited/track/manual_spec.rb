require 'rails_helper'

RSpec.describe Sequel::Plugins::Audited, 'manuals' do
  before(:all) do
    DB.create_table!(:fake_manuals_authors) do
      primary_key :id
      String :name
    end

    module FakeManual
      class Author < Sequel::Model(:fake_manuals_authors)
        plugin :audited, on: :update
      end
    end
  end

  after(:all) do
    DB.drop_table(:fake_manuals_authors)
  end

  around(:each) do |example|
    Sequel::Audited.enabled = true
    example.run
    Sequel::Audited.enabled = false
  end

  let(:author) { FakeManual::Author.create(name: 'author1') }
  let(:audit_record) { AuditLog.last }

  context 'add_change' do
    let(:changes) do
      {
        'somefield' => 'somechange'
      }
    end

    it 'creates correct audit record' do
      expect{ author.add_change(:somefield, 'somechange') }
        .to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(author.class.name)
      expect(audit_record.model_pk).to eq(author.id)

      expect(audit_record.model_ref).to eq(nil)
      expect(audit_record.event).to eq('created_manually')
      expect(audit_record.version).to eq(1)
      expect(audit_record.user_id).to be_nil
      expect(audit_record.username).to eq('system')
      expect(audit_record.original_user_id).to be_nil
      expect(audit_record.original_username).to be_nil
      expect(audit_record.changed).to eq(changes)
    end
  end
end
