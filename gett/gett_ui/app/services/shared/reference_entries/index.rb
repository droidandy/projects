using Sequel::CoreRefinements

module Shared::ReferenceEntries
  class Index < ApplicationService
    attributes :query

    MAX_AMOUNT = 50
    private_constant :MAX_AMOUNT

    def execute!
      { items: reference_entries }
    end

    private def reference_entries
      @reference_entries ||= reference_entries_dataset.all
    end

    private def reference_entries_dataset
      DB[:reference_entries]
        .inner_join(:booking_references, id: :booking_reference_id)
        .where(:booking_references[:id] => query[:booking_reference_id])
        .grep(:reference_entries[:value], "%#{query[:search_term]}%", case_insensitive: true)
        .select(:reference_entries.*)
        .order(:reference_entries[:id].asc)
        .limit(MAX_AMOUNT)
    end
  end
end
