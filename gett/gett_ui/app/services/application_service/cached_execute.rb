module ApplicationService::CachedExecute
  def execute(*)
    return self if executed?

    super
    @executed = true

    self
  end

  def executed?
    !!@executed
  end
end
