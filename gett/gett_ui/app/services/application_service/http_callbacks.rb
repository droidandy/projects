class ApplicationService::HttpCallbacks
  def request(&block)
    @on_request = block
  end

  def response(&block)
    @on_response = block
  end

  def success(&block)
    @on_success = block
  end

  def error(&block)
    @on_error = block
  end

  def failure(&block)
    @on_failure = block
  end

  def on_request(*args)
    @on_request&.call(*args)
  end

  def on_response(response)
    @on_response&.call(response)
  end

  def on_success(response)
    @on_success&.call(response)
  end

  def on_failure(*args)
    @on_failure&.call(*args)
  end

  def on_error(error)
    @on_error&.call(error)
  end
end
