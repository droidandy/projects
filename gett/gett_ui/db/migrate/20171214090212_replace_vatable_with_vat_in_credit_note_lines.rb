using Sequel::CoreRefinements

Sequel.migration do
  up do
    add_column :credit_note_lines, :vat, :integer, null: false, default: 0
    DB[:credit_note_lines].where(vatable: true).update(vat: :amount_cents * Settings.vat_rate)
    drop_column :credit_note_lines, :vatable
  end

  down do
    add_column :credit_note_lines, :vatable, :boolean, null: false, default: false
    DB[:credit_note_lines].where{ vat > 0 }.update(vatable: true)
    drop_column :credit_note_lines, :vat
  end
end
