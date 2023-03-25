Sequel.migration do
  change do
    create_table :errors do
      primary_key :id
      String :subject_gid
      String :fingerprint, null: false
      String :error_class, null: false
      String :message, null: false
      column :backtrace, "text[]", null: false
      Integer :raised_count, null: false, default: 1

      timestamps

      index :subject_gid
      index :fingerprint, unique: true
    end
  end
end
