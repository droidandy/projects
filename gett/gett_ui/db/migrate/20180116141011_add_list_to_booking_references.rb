Sequel.migration do
  change do
    alter_table :booking_references do
      add_column :attachment, :text
    end
  end
end
