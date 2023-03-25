class BbcReferencesLoader < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    DB[:reference_entries].where(booking_reference_id: booking_reference_ids).delete

    DB[:reference_entries].import(
      [:booking_reference_id, :value],
      booking_reference_ids.product(reference_entry_values)
    )
  end

  private def booking_reference_ids
    @booking_reference_ids ||=
      BookingReference.where(
        priority: 0,
        company_id: Company.bbc.active.select(:id)
      ).select_map(:id)
  end

  private def reference_entry_values
    @reference_entry_values ||=
      Sequel.connect(Settings.ot_charges_db.to_h) do |db|
        db[:ot_company_reference_import].where(
          reference_id: Settings.bbc.reference_id,
          active_flag: 'Y'
        ).select_map{ rtrim(value) }
      end
  end
end
