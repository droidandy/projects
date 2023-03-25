class SequelLocator
  def locate(gid)
    gid.model_class.with_pk!(gid.model_id)
  end
end
