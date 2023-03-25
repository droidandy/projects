module Documents
  class Approve < ApplicationService
    attr_reader :updated_document

    schema do
      required(:document_id).filled(:int?)
      required(:metadata).filled
    end

    def execute!
      raise ActiveRecord::RecordNotFound unless document
      authorize! document

      super do
        compose(
          Documents::Metadata::Save.new(current_user, document: document, metadata: metadata),
          :updated_document
        )
        next unless @updated_document

        document.update(started_at: Time.zone.today.beginning_of_day) unless document.started_at

        compose(Documents::ChangeStatus.new(current_user, document: document, status: 'approved'))
      end
    end

    def document
      @document ||= begin
        search = Documents::Search.new({ id: document_id }, current_user: current_user)
        search.one
      end
    end
  end
end
