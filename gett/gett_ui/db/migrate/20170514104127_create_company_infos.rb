using Sequel::CoreRefinements

Sequel.migration do
  up do
    extension :pg_triggers, :address_lookup_triggers

    create_table :company_infos do
      primary_key :id
      foreign_key :company_id, :companies

      String :name, null: false
      String :legal_name
      String :vat_number
      String :cost_centre
      foreign_key :address_id, :addresses
      foreign_key :legal_address_id, :addresses
      foreign_key :salesman_id, :salesmen
      foreign_key :contact_id, :contacts
      Float :booking_fee
      Float :run_in_fee
      Float :handling_fee

      Boolean :active, null: false, default: true

      timestamps
    end

    add_address_reference(:company_infos)
    add_address_reference(:company_infos, column_name: :legal_address_id, prefix: 'legal_')

    from(:company_infos).insert(
      [ :company_id, :name, :legal_name, :vat_number, :cost_centre, :salesman_id, :address_id, :legal_address_id,
        :booking_fee, :run_in_fee, :handling_fee, :created_at, :updated_at, :active ],
      from(:companies)
        .left_join(:company_addresses.as(:addresses), company_id: :id, legal: false)
        .left_join(:company_addresses.as(:legal_addresses), company_id: :companies[:id], legal: true)
        .left_join(:payment_options.as(:options), company_id: :companies[:id])
        .select(
          :companies[:id], :name, :legal_name, :vat_number, :cost_centre, :salesman_id, :addresses[:address_id], :legal_addresses[:address_id],
          :options[:booking_fee], :options[:run_in_fee], :options[:handling_fee], :companies[:created_at], :companies[:updated_at], true
        )
    )

    alter_table :bookings do
      add_foreign_key :company_info_id, :company_infos
    end

    booking_companies = from(:members)
      .join(:companies, id: :company_id)
      .join(:company_infos, company_id: :id)
      .select(:members[:id].as(:booker_id), :company_infos[:id].as(:company_info_id))
    from(:bookings, booking_companies.as(:booking_companies))
      .where(:booking_companies[:booker_id] => :bookings[:booker_id])
      .update(company_info_id: :booking_companies[:company_info_id])

    alter_table :contacts do
      add_column :active, :Boolean, null: false, default: true
    end

    alter_table :companies do
      drop_column :name
      drop_column :legal_name
      drop_column :vat_number
      drop_column :cost_centre
      drop_column :salesman_id
    end

    alter_table :payment_options do
      drop_column :booking_fee
      drop_column :run_in_fee
      drop_column :handling_fee
    end

    drop_table :company_addresses
  end

  down do
    create_table :company_addresses do
      primary_key :id
      foreign_key :company_id, :companies, null: false
      foreign_key :address_id, :addresses, null: false
      Boolean :legal, null: false, default: false

      timestamps

      index [:company_id, :address_id], uniq: true
    end

    alter_table :companies do
      add_column :name, String
      add_column :legal_name, String
      add_column :vat_number, String
      add_column :cost_centre, String

      add_foreign_key :salesman_id, :salesmen
    end

    alter_table :payment_options do
      add_column :booking_fee, Float
      add_column :run_in_fee, Float
      add_column :handling_fee, Float
    end

    from(:company_addresses).insert(
      [:company_id, :address_id, :created_at, :updated_at, :legal],
      from(:company_infos).where(active: true).exclude(address_id: nil)
        .select(:company_id, :address_id, :created_at, :updated_at, false)
    )

    from(:company_addresses).insert(
      [:company_id, :address_id, :created_at, :updated_at, :legal],
      from(:company_infos).where(active: true).exclude(legal_address_id: nil)
        .select(:company_id, :legal_address_id, :created_at, :updated_at, true)
    )

    from(:companies, :company_infos)
      .where(:company_infos[:company_id] => :companies[:id], :company_infos[:active] => true)
      .update(
        name:        :company_infos[:name],
        legal_name:  :company_infos[:legal_name],
        vat_number:  :company_infos[:vat_number],
        cost_centre: :company_infos[:cost_centre],
        salesman_id: :company_infos[:salesman_id]
      )

    from(:payment_options, :company_infos)
      .where(:company_infos[:company_id] => :payment_options[:company_id], :company_infos[:active] => true)
      .update(
        booking_fee:  :company_infos[:booking_fee],
        run_in_fee:   :company_infos[:run_in_fee],
        handling_fee: :company_infos[:handling_fee]
      )

    alter_table :bookings do
      drop_column :company_info_id
    end

    alter_table :contacts do
      drop_column :active
    end

    drop_table :company_infos
  end
end
