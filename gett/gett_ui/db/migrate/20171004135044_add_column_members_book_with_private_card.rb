Sequel.migration do
  change do
    alter_table :members do
      add_column :allow_personal_card_usage, :boolean, default: false
    end
  end
end
