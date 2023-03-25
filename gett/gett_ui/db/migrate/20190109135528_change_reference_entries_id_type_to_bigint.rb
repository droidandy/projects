Sequel.migration do
  up do
    set_column_type :reference_entries, :id, 'bigint'
  end
end
