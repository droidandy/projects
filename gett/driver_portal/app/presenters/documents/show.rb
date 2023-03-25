module Documents
  class Show < ApplicationPresenter
    attr_reader :document

    COLUMNS_TO_SHOW = %i[
      id
      approval_status
      content_type
      expires_at
      file_name
      metadata
    ].freeze

    def initialize(document)
      @document = document
    end

    def as_json(with_user: false, with_vehicle: false)
      convert_to_json(document, only: COLUMNS_TO_SHOW) do |json|
        json[:file_url] = document.file.full_url
        json[:kind] = presenter_for(document.kind).as_json
        json[:agent] = agent_data
        json[:user] = document.user.attributes.slice('id', 'approval_status') if with_user
        json[:vehicle] = document.vehicle.attributes.slice('id', 'approval_status') if with_vehicle && document.vehicle
        json[:last_change] = presenter_for(document.last_change).as_json if document.last_change
        json[:expiration_warning] = expiration_warning
      end
    end

    private def expiration_warning
      true if document.expires_at && document.expires_at < Document::EXPIRATION_THRESHOLD.from_now
    end

    private def agent_data
      { id: document.agent.id, name: document.agent.name } if document.agent
    end
  end
end
