Sequel.migration do
  up do
    add_column :messages, :message_type, String
    add_index :messages, :message_type

    DB[:messages]
      .where do
        (~(title =~ 'Last Deploy') | (title =~ nil)) & (company_id =~ nil)
      end
      .update(message_type: 'external')

    DB[:messages].exclude(company_id: nil).update(message_type: 'internal')
    DB[:messages].where(title: 'Last Deploy').update(message_type: 'deployment')
  end

  down do
    drop_column :messages, :message_type
  end
end
