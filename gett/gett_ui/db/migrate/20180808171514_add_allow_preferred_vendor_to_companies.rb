Sequel.migration do
  change do
    alter_table :companies do
      add_column :allow_preferred_vendor, :boolean, default: false
    end

    alter_table :members do
      add_column :allow_preferred_vendor, :boolean, default: false
    end
  end
end
