using Sequel::CoreRefinements

module ReferenceEntries
  class Index < Shared::ReferenceEntries::Index
    include ::ApplicationService::Context

    delegate :company, to: :context

    private def reference_entries_dataset
      super.where(:booking_references[:company_id] => company.id)
    end
  end
end
