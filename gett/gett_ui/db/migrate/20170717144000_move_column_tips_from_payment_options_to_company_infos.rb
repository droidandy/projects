using Sequel::CoreRefinements

Sequel.migration do
  up do
    add_column :company_infos, :tips, Float

    from(:company_infos, :payment_options)
      .where(:payment_options[:company_id] => :company_infos[:company_id])
      .update(tips: :payment_options[:tips])

    drop_column :payment_options, :tips
  end

  down do
    add_column :payment_options, :tips, Float

    from(:payment_options, :company_infos)
      .where(:payment_options[:company_id] => :company_infos[:company_id])
      .where(:company_infos[:active] => true)
      .update(tips: :company_infos[:tips])

    drop_column :company_infos, :tips
  end
end
