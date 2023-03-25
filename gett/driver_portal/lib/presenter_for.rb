module PresenterFor
  def presenter_for(record, action: :show)
    return if record.blank?

    klass = "#{record.class.name.pluralize}::#{action.to_s.classify}".constantize
    klass.new(record)
  end
end
