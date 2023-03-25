require 'rails_helper'

RSpec.describe Sequel::Plugins::Audited, 'many_to_one' do
  before(:all) do
    DB.create_table!(:fake_mtoo_authors) do
      primary_key :id
      String :name
    end

    DB.create_table!(:fake_mtoo_albums) do
      primary_key :id
      Integer :author_id
      String :name
    end

    module FakeMtoo
      class Author < Sequel::Model(:fake_mtoo_authors); end

      class Album < Sequel::Model(:fake_mtoo_albums)
        many_to_one :author, class: FakeMtoo::Author, key: :author_id

        plugin :audited,
          many_to_one: [
            author: {
              name: :name,
              relation: :author,
              class: FakeMtoo::Author,
              key: :author_id
            }
          ]
      end
    end
  end

  after(:all) do
    DB.drop_table(:fake_mtoo_authors)
    DB.drop_table(:fake_mtoo_albums)
  end

  let(:author) { FakeMtoo::Author.create(name: 'author1') }
  let(:album) { FakeMtoo::Album.create(name: 'album1', author: author) }
  let(:audit_record) { AuditLog.last }

  after(:each) do
    Sequel::Audited.enabled = false
  end

  before do
    author
    album
  end

  context 'create' do
    let(:album2) { FakeMtoo::Album.create(name: 'album2', author: author) }
    let(:changes) do
      {
        'associations' => {
          'author' => [
            { 'key' => nil, 'name' => nil },
            { 'key' => author.id, 'name' => author.name }
          ]
        }
      }
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect do
        album2
      end.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(album2.class.name)
      expect(audit_record.model_pk).to eq(album2.id)
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

  context 'update' do
    let(:author2) { FakeMtoo::Author.create(name: 'author2') }
    let(:changes) do
      {
        'associations' => {
          'author' => [
            { 'key' => author.id, 'name' => author.name },
            { 'key' => author2.id, 'name' => author2.name }
          ]
        }
      }
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect do
        album.update(author: author2)
      end.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(album.class.name)
      expect(audit_record.model_pk).to eq(album.id)
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
        'associations' => {
          'author' => [
            { 'key' => author.id, 'name' => author.name },
            { 'key' => nil, 'name' => nil }
          ]
        }
      }
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect do
        album.destroy
      end.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(album.class.name)
      expect(audit_record.model_pk).to eq(album.id)
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
