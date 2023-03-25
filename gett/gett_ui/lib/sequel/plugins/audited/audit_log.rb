class AuditLog < Sequel::Model
  # handle versioning of audited records
  plugin :list, field: :version, scope: [:model_type, :model_pk]
  plugin :timestamps
  plugin :serialization, :json, :changed

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
    self.username          = user.try(:full_name) || ((user.is_a?(String) || user.is_a?(Symbol)) ? user.to_s : 'system'.freeze)
    self.original_user_id  = original_user&.id
    self.original_username = original_user&.full_name
  end
end
