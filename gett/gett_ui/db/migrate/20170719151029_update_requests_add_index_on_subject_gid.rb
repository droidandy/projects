Sequel.migration do
  change do
    alter_table :requests do
      add_index :subject_gid
    end
  end
end
