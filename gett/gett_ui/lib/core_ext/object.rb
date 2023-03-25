class Object
  # TODO: remove if move to Ruby 2.5+
  def yield_self
    yield self
  end

  # TODO: remove if move to Ruby 2.6+
  alias then yield_self
end
