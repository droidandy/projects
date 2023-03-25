module Pages
  class EmailPage < SitePrism::Page
    def self.load_validations
      [
        proc do
          [has_from?, 'Email was not loaded']
        end
      ]
    end

    element :from,    '#message_headers dl dd:nth-child(2)'
    element :subject, '#message_headers dl dd:nth-child(4) strong'
    element :date,    '#message_headers dl dd:nth-child(6)'
    element :to,      '#message_headers dl dd:nth-child(8)'
    element :attachment, '#message_headers dl dd:nth-child(10)'

    class EmailBody < SitePrism::Page
      element :logo, '.mcnImage'
      element :body, 'body'

      element :iphone_app, :xpath, '//a[img[@alt = "Apple"]]'
      element :android_app, :xpath, '//a[img[@alt = "Android"]]'
    end

    iframe :body, EmailBody, 0
  end
end
