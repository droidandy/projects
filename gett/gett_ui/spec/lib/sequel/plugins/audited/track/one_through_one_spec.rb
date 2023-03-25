require 'rails_helper'

RSpec.describe Sequel::Plugins::Audited, 'one_through_one' do
  before(:all) do
    DB.create_table!(:fake_otho_authors) do
      primary_key :id
      String :name
    end

    DB.create_table!(:fake_otho_albums) do
      primary_key :id
      String :name
    end

    DB.create_table!(:fake_otho_albums_authors) do
      # important (without primary key audit doesn't work)
      primary_key :id
      Integer :album_id
      Integer :author_id
      String :field, default: 'only'
    end

    module FakeOtho
      class Author < Sequel::Model(:fake_otho_authors)
      end

      class Album < Sequel::Model(:fake_otho_albums)
        # important!!! (this plugin create auditing methods for this model)
        plugin :audited
        one_through_one :author,
          class: 'FakeOtho::Author',
          join_table: :fake_otho_albums_authors,
          left_key: :album_id,
          right_key: :author_id
      end

      class AlbumsAuthors < Sequel::Model(:fake_otho_albums_authors)
        many_to_one :album, class: 'FakeOtho::Album', key: :album_id
        many_to_one :author, class: 'FakeOtho::Author', key: :author_id

        plugin :audited,
          one_through_one: [
            author: {
              target_key: :author_id,
              target_model: FakeOtho::Author,
              observed_key: :album_id,
              observed_model: FakeOtho::Album,
              name: :name,
              only: ->(album_author) { album_author.field == 'only' }
            }
          ]
      end
    end
  end

  after(:all) do
    DB.drop_table(:fake_otho_authors)
    DB.drop_table(:fake_otho_albums)
    DB.drop_table(:fake_otho_albums_authors)
  end

  let(:author) { FakeOtho::Author.create(name: 'author1') }
  let(:album) { FakeOtho::Album.create(name: 'album1') }
  let(:album_author) { FakeOtho::AlbumsAuthors.create(author: author, album: album) }
  let(:audit_record) { AuditLog.last }

  after(:each) do
    Sequel::Audited.enabled = false
  end

  before do
    author
    album
  end

  context 'only' do
    context 'with only unmatch' do
      it 'doesnt create correct audit record' do
        Sequel::Audited.enabled = true

        expect do
          FakeOtho::AlbumsAuthors.create(author: author, album: album, field: 'unmatch')
        end.to change(AuditLog, :count).by(0)
      end
    end
  end

  context 'create' do
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
        FakeOtho::AlbumsAuthors.create(author: author, album: album)
      end.to change(AuditLog, :count).by(1)

      expect(audit_record.model_type).to eq(album.class.name)
      expect(audit_record.model_pk).to eq(album.id)
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
    let(:author2) { FakeOtho::Author.create(name: 'author2') }
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

    before do
      album_author
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect do
        album_author.update(author: author2)
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

    before do
      album_author
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect do
        album_author.destroy
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
