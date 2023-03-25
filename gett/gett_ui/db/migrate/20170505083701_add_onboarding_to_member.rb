Sequel.migration do
  change do
    add_column :members, :onboarding, :boolean
  end
end
