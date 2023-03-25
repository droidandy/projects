module ThreadPatch
  def new(**args)
    var = Thread.current[:request_store]
    new_proc =
      proc do |**ar|
        Thread.current[:request_store] = var
        yield **ar
      end
    super(**args, &new_proc)
  end
end

Thread.singleton_class.class_eval do
  prepend ThreadPatch
end
