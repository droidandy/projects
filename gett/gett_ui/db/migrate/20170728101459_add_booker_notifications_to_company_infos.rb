Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :booker_notifications, 'Boolean', default: true, nil: false
    end
  end
end
