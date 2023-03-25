class DevEmailInterceptor
  def self.delivering_email(message)
    message.subject = "[#{Rails.env.upcase}] #{message.subject}"
    message.to  = "\"#{message.to.first}\" <gettenterprise@gmail.com>"
    message.cc  = nil unless message.cc.nil?
    message.bcc = nil unless message.bcc.nil?
  end
end
