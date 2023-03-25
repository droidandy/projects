class HtmlDeliveryMethod < LetterOpener::DeliveryMethod
  def deliver!(mail)
    validate_mail!(mail)
    location = File.join(settings[:location], "#{mail.to.join('_')}_#{Time.now.to_f.to_s.tr('.', '_')}")

    LetterOpener::Message.rendered_messages(mail, location: location, message_template: settings[:message_template])
  end
end
