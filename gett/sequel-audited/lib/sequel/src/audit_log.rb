class AuditLog < Sequel::Model
  # handle versioning of audited records
  plugin :list, field: :version, scope: [:model_type, :model_pk]
  plugin :timestamps
  plugin :serialization, :json, :changed

  # TODO: see if we should add these
  # many_to_one :associated, polymorphic: true
  # many_to_one :user,       polymorphic: true

  def before_validation
    super
    return unless context = RequestStore.store[:service_context]

    if context[:reincarnated] && context[:original_user]
      user          = context[:user]
      original_user = context[:original_user]
    elsif context[:reincarnated] && context[:original_user].nil?
      # When backoffice user making front-office-like changes
      user = context[:admin]
    else
      user = context[:user] || context[:admin]
    end

    self.user_id           = user.try(:id)
    self.username          = user.try(:full_name) || (String === user || Symbol === user ? user.to_s : 'system')
    self.original_user_id  = original_user&.id
    self.original_username = original_user&.full_name
  end

  # private

  # Obtains the `current_user` based upon the `:audited_current_user_method' value set in the
  # audited model, either via defaults or via :user_method config options
  #
  # # NOTE! this allows overriding the default value on a per audited model
  def audit_user
    m = Kernel.const_get(model_type)
    send(m.audited_current_user_method)
  end
end
