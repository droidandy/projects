Sequel.migration do
  change do
    add_column :alerts, :resolved, :boolean, default: false, null: false
  end
end
