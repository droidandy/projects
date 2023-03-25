using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :booking_references do
      add_column :priority, Integer
    end

    ranks = from(:booking_references)
      .select(:id, Sequel.function(:rank).over(partition: :company_id, order: :id).as(:priority))

    from(:booking_references, ranks.as(:ranks))
      .where(:booking_references[:id] => :ranks[:id])
      .update(priority: :ranks[:priority])

    alter_table :booking_references do
      set_column_not_null :priority
    end
  end

  down do
    alter_table :booking_references do
      drop_column :priority
    end
  end
end
