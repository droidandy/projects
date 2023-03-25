using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :companies do
      add_column :booker_notifications_emails, String, text: true
      add_column :booker_notifications, 'Boolean', default: true, nil: false
    end

    from(:companies, :company_infos)
      .where(:company_infos[:company_id] => :companies[:id], :company_infos[:active] => true)
      .update(booker_notifications: :company_infos[:booker_notifications])

    drop_column :company_infos, :booker_notifications
  end

  down do
    add_column :company_infos, :booker_notifications, 'Boolean', default: true, nil: false

    from(:company_infos, :companies)
      .where(:company_infos[:company_id] => :companies[:id], :company_infos[:active] => true)
      .update(booker_notifications: :companies[:booker_notifications])

    alter_table :companies do
      drop_column :booker_notifications_emails
      drop_column :booker_notifications
    end
  end
end
