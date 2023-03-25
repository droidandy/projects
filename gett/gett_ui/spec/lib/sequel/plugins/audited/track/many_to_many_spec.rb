require 'rails_helper'

RSpec.describe Sequel::Plugins::Audited, 'many_to_many' do
  before(:all) do
    DB.create_table!(:fake_mtom_authors) do
      primary_key :id
      String :name
    end

    DB.create_table!(:fake_mtom_albums) do
      primary_key :id
      Integer :author_id
      String :name
    end

    DB.create_table!(:fake_mtom_albums_authors) do
      Integer :album_id
      Integer :author_id
    end

    module FakeMtom
      class Album < Sequel::Model(:fake_mtom_albums)
        plugin :association_pks

        many_to_many :authors,
          class: 'FakeMtom::Author',
          left_key: :album_id,
          right_key: :author_id,
          join_table: :fake_mtom_albums_authors,
          delay_pks: :always
      end

      class Author < Sequel::Model(:fake_mtom_albums)
        plugin :association_pks
        plugin :audited,
          many_to_many: [
            albums: {
              name: :name,
              class: FakeMtom::Album,
              relation: :albums
            }
          ]

        many_to_many :albums,
          class: 'FakeMtom::Album',
          left_key: :author_id,
          right_key: :album_id,
          join_table: :fake_mtom_albums_authors,
          delay_pks: :always
      end
    end
  end

  after(:all) do
    DB.drop_table(:fake_mtom_authors)
    DB.drop_table(:fake_mtom_albums)
    DB.drop_table(:fake_mtom_albums_authors)
  end

  let(:album) { FakeMtom::Album.create(name: 'album') }
  let(:audit_record) { AuditLog.last }

  after(:each) do
    Sequel::Audited.enabled = false
  end

  before do
    author
    album
  end

  context 'change_many' do
    let(:changes) do
      {
        'albums' => [
          [],
          [{ 'key' => album.id, 'name' => album.name }]
        ]
      }
    end

    context 'persisted author' do
      let(:author) { FakeMtom::Author.create(name: 'author') }

      it 'creates correct audit record' do
        Sequel::Audited.enabled = true

        expect do
          author.album_pks = [album.id]
          author.save
        end.to change(AuditLog, :count).by(1)

        expect(audit_record.model_type).to eq(author.class.name)
        expect(audit_record.model_pk).to eq(author.id)
        expect(audit_record.model_ref).to eq(nil)
        expect(audit_record.event).to eq('change_many')
        expect(audit_record.version).to eq(1)
        expect(audit_record.user_id).to be_nil
        expect(audit_record.username).to eq('system')
        expect(audit_record.original_user_id).to be_nil
        expect(audit_record.original_username).to be_nil
        expect(audit_record.changed).to eq(changes)
      end
    end

    context 'new author' do
      let(:author) { FakeMtom::Author.new(name: 'author') }

      it 'creates correct audit record' do
        Sequel::Audited.enabled = true

        expect do
          author.album_pks = [album.id]
          author.save
        end.to change(AuditLog, :count).by(1)

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
  end
end
