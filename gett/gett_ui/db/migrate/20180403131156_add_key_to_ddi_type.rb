using Sequel::CoreRefinements

Sequel.migration do
  no_transaction

  up do
    add_enum_value :ddi_type, 'key', if_not_exists: true
    from(:ddis).where(type: 'standard').update(type: 'key')
    from(:ddis).where(type: 'small').update(type: 'standard')
  end

  down do
    from(:ddis).where(type: 'standard').update(type: 'small')
    from(:ddis).where(type: 'key').update(type: 'standard')
  end
end
