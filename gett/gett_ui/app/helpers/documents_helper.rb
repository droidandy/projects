module DocumentsHelper
  INVOICE_OTE_ADDRESS_CHANGE_DATE = '2018-12-06'.to_date.freeze

  def document_image_tag(path, options = {})
    if @_format == :pdf
      wicked_pdf_image_tag("images/#{path}", options)
    else
      image_tag(path)
    end
  end

  def document_stylesheet_link_tag(name)
    if @_format == :pdf
      wicked_pdf_stylesheet_link_tag(name)
    else
      stylesheet_link_tag(name)
    end
  end

  def image_path(image)
    "file://#{Rails.root.join('public/images', image)}"
  end

  def format_cents(amount)
    format('%.2f', (amount.to_f / 100))
  end

  def invoice_ote_company_address
    if @invoice.created_at > INVOICE_OTE_ADDRESS_CHANGE_DATE
      Settings.ote.company_address
    else
      Settings.ote.company_address_old
    end
  end
end
