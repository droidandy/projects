Sequel.migration do
  fkeys = %w(company_id_fkey department_id_fkey id_fkey role_id_fkey work_role_id_fkey)

  up do
    rename_table :bookers, :members

    fkeys.each{ |key| run "ALTER TABLE members RENAME CONSTRAINT bookers_#{key} TO members_#{key}" }

    from(:users).where(kind: 'Booker').update(kind: 'Member')
  end

  down do
    rename_table :members, :bookers

    fkeys.each{ |key| run "ALTER TABLE bookers RENAME CONSTRAINT members_#{key} TO bookers_#{key}" }

    from(:users).where(kind: 'Member').update(kind: 'Booker')
  end
end
