class Documents::CreateForDriver < ApplicationService
  attr_reader :document, :admin

  schema do
    required(:file).filled
    required(:kind_slug).filled(:str?)
  end

  def initialize(current_user, admin, params)
    super(current_user, params)
    @admin = admin
  end

  def execute!
    @document = Document.new(attributes)

    authorize! @document, :create?

    super do
      return unless @document.save

      hide_old_documents!

      compose(Users::UpdateApprovalStatus.new(current_user, user: @document.user))
      compose(Users::CheckQueueStatus.new(current_user, user: @document.user))
    end
  end

  on_fail { errors!(@document.errors.to_h) if @document.present? }

  private def attributes
    {
      agent: admin,
      file: file,
      kind: kind,
      user: current_user
    }
  end

  private def kind
    @kind ||= ::Documents::Kind.find_by(slug: kind_slug, owner: :driver)
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
      search = ::Documents::Search.new({ kind: kind, except_id: document.id }, current_user: current_user)
      search.resolved_scope
    end
  end
end
