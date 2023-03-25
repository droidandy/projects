class ApplicationMailer < ActionMailer::Base
  include ActionView::Helpers::AssetUrlHelper
  include ActionView::Helpers::AssetTagHelper
  helper_method :image_set_tag, :short_image_set_tag

  ActionMailer::Base.register_interceptor(RedirectOutgoingMails) if Rails.env == 'production'

  default from: 'drivers.uk@gett.com'
  layout 'mailer'

  def image_set_tag(source, srcset = {}, options = {})
    srcset = srcset.map { |size, src| "#{path_to_image(src)} #{size}" }.join(', ')
    image_tag(source, options.merge(srcset: srcset))
  end

  def short_image_set_tag(source, options = {})
    srcset = { '2x' => source, '3x' => source }
    image_set_tag(source, srcset, options)
  end
end
