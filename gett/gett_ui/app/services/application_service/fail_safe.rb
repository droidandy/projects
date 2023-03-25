require 'error'

module ApplicationService::FailSafe
  def fail_safe(subject: nil, silence: false, fail_on_error: false, **opts)
    # can't use `retry` as local variable name since it's a keyword
    re_try = opts[:retry] || {StandardError => 0}
    re_try = {StandardError => re_try} unless re_try.is_a?(Hash)
    re_try[StandardError] = 0 unless re_try.key?(StandardError)
    handled_errors = re_try.keys

    begin
      yield
    rescue *handled_errors => error
      klass = error.class.ancestors.find{ |c| handled_errors.include?(c) }
      if re_try[klass] > 0
        re_try[klass] -= 1
        retry
      end

      Airbrake.notify(error)
      ::Error.save(error, subject_gid: subject&.to_gid&.to_s)
      fail! if fail_on_error # drops successfull execution status, if there was any
      raise unless silence
    end
  end
end
