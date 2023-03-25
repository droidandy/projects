Sequel.migration do
  up do
    add_column :payment_options, :default_payment_type, :payment_type

    from(:payment_options)
      .update(default_payment_type: Sequel.case(
        {Sequel.pg_array_op(Sequel[:payment_types]).contains('{account}') => 'account'},
        Sequel.pg_array_op(Sequel[:payment_types])[1]
      ))

    alter_table :payment_options do
      set_column_not_null :default_payment_type
    end
  end

  down do
    drop_column :payment_options, :default_payment_type
  end
end
