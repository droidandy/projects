module ApplicationService::DocumentRenderer
  extend ActiveSupport::Concern

  DEFAULT_PDF_OPTIONS = {
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    page_height: 297,
    page_width: 212
  }.freeze

  included do
    attributes :format
  end

  module ClassMethods
    def pdf_options(options = nil)
      @pdf_options = options unless options.nil?
      @pdf_options || {}
    end
  end

  def execute!
    case format
    when :html then render_html
    when :pdf then render_pdf
    end
  end

  def filename
    template_name
  end

  private def render_pdf
    WickedPdf.new.pdf_from_string(render_html, pdf_options)
  end

  private def pdf_options
    DEFAULT_PDF_OPTIONS.deep_merge(self.class.pdf_options)
  end

  private def render_html
    DocumentsController.render(
      template: "documents/#{template_name}",
      layout: "layouts/#{layout_name}",
      assigns: template_assigns.merge(_format: format)
    )
  end

  private def layout_name
    'document'
  end

  private def template_name
    self.class.name.demodulize.underscore
  end

  private def template_assigns
    {}
  end
end
