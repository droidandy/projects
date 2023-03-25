Sequel.migration do
  up do
    add_column :bookers, :avatar, String
    add_column :companies, :logo, String
    drop_column :companies, :logo_url
  end

  down do
    drop_column :bookers, :avatar
    drop_column :companies, :logo
    add_column :bookers, :logo_url, String
  end
end
