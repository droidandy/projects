using Sequel::CoreRefinements

Sequel.migration do
  up do
    extension :string_agg

    alter_table :payments do
      add_column :fingerprint, String, null: false, default: ''
    end

    rows = from(:payments)
      .left_join(:invoices_payments, payment_id: :id)
      .select(
        :payments[:id],
        :amount_cents,
        :booking_id,
        Sequel.string_agg(:invoices_payments[:invoice_id].cast(String), ':')
          .order(:invoices_payments[:invoice_id])
          .as(:invoices_value)
      )
      .group(:payments[:id])
      .all

    rows.each do |row|
      value = row.values_at(:amount_cents, :booking_id, :invoices_value).join(':')
      fingerprint = Digest::MD5.hexdigest(value)
      from(:payments).where(id: row[:id]).update(fingerprint: fingerprint)
    end
  end

  down do
    alter_table :payments do
      drop_column :fingerprint
    end
  end
end
