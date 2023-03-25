module FiberPatch
  def new(*args, &block)
    var = Thread.current[:request_store]
    new_proc =
      proc do |*ar, &bl|
        Thread.current[:request_store] = var
        block.call(*ar, &bl)
      end
    super(*args, &new_proc)
  end
end

Fiber.singleton_class.class_eval do
  prepend FiberPatch
end
