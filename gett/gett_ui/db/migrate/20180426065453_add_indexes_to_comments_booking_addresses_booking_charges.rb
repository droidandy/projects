Sequel.migration do
  up do
    # some (actually all) mentioned indexes have already been added to production
    # env. thus, such uncommon usage with overridden DB.add_index method
    add_index :comments, :author_id, if_not_exists: true
    add_index :comments, :member_id, if_not_exists: true
    add_index :comments, :booking_id, if_not_exists: true
    add_index :comments, :company_id, if_not_exists: true

    add_index :booking_addresses, :address_id, if_not_exists: true
    add_index :booking_addresses, :booking_id, if_not_exists: true

    add_index :booking_charges, :booking_id, if_not_exists: true
  end

  down do
    alter_table :comments do
      drop_index :author_id
      drop_index :member_id
      drop_index :booking_id
      drop_index :company_id
    end

    alter_table :booking_addresses do
      drop_index :address_id
      drop_index :booking_id
    end

    alter_table :booking_charges do
      drop_index :booking_id
    end
  end
end
