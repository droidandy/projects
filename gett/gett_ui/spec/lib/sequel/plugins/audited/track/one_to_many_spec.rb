require 'rails_helper'

RSpec.describe Sequel::Plugins::Audited, 'one_to_many' do
  before(:all) do
    DB.create_table!(:fake_otom_authors) do
      primary_key :id
      String :name
    end

    DB.create_table!(:fake_otom_albums) do
      primary_key :id
      Integer :author_id
      String :name
    end

    module FakeOtom
      class Author < Sequel::Model(:fake_otom_authors)
        plugin :audited

        one_to_many :albums,
          class: 'FakeOtom::Album',
          delay_pks: :always
      end

      class Album < Sequel::Model(:fake_otom_albums)
        plugin :audited,
          one_to_many: [
            author: {
              name: :name,
              model: FakeOtom::Author,
              key: :author_id,
              observed_association: :albums
            }
          ]

        many_to_one :author,
          class: 'FakeOtom::Author',
          delay_pks: :always
      end
    end
  end

  after(:all) do
    DB.drop_table(:fake_otom_authors)
    DB.drop_table(:fake_otom_albums)
  end

  let(:author) { FakeOtom::Author.create(name: 'author') }
  let(:audit_record) { AuditLog.last }

  after(:each) do
    Sequel::Audited.enabled = false
  end

  before do
    author
  end

  context 'change_many' do
    let(:album) { FakeOtom::Album.create(name: 'album', author: author) }
    let(:changes) do
      {
        'albums' => [
          [],
          [{ 'key' => album.id, 'name' => album.name }]
        ]
      }
    end

    it 'creates correct audit record' do
      Sequel::Audited.enabled = true

      expect do
        album
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
end
