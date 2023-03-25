class Documents::CreateForVehicle < ApplicationService
  attr_reader :document, :admin

  schema do
    required(:file).filled
    required(:kind_slug).filled(:str?)
    required(:vehicle_id).filled(:int?)
  end

  def initialize(current_user, admin, params)
    super(current_user, params)
    @admin = admin
  end

  def execute!
    raise ActiveRecord::RecordNotFound unless vehicle

    @document = Document.new(attributes)

    authorize! @document, :create?

    super do
      return unless @document.save

      hide_old_documents!

      compose(Vehicles::UpdateApprovalStatus.new(current_user, vehicle: @document.vehicle))
      compose(Users::CheckQueueStatus.new(current_user, user: @document.user))
    end
  end

  on_fail { errors!(@document.errors.to_h) if @document.present? }

  private def attributes
    {
      agent: admin,
      file: file,
      kind: kind,
      user: current_user,
      vehicle: vehicle
    }
  end

  private def vehicle
    @vehicle ||= begin
      search = Vehicles::Search.new({ id: vehicle_id }, current_user: current_user)
      search.one
    end
  end

  private def kind
    @kind ||= ::Documents::Kind.find_by(slug: kind_slug, owner: :vehicle)
  end

  private def hide_old_documents!
    ActiveRecord::Base.transaction do
      old_documents.each do |doc|
        doc.update! hidden: true
      end
    end
  end

  private def old_documents
    @old_documents ||= begin
      query = { kind: kind, except_id: document.id, vehicle: vehicle }
      search = ::Documents::Search.new(query, current_user: current_user)
      search.resolved_scope
    end
  end
end
