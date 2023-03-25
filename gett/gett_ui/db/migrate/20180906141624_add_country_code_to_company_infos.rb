using Sequel::CoreRefinements

Sequel.migration do
  up do
    add_column :company_infos, :country_code, String

    from(:company_infos, :addresses)
      .where{ (active =~ true) & (address_id =~ :addresses[:id]) }
      .update(country_code: :addresses[:country_code])

    add_index :company_infos, :country_code, if_not_exists: true
  end

  down do
    drop_column :company_infos, :country_code
    drop_index :company_infos, :country_code
  end
end
