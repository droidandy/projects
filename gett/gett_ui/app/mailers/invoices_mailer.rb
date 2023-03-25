class InvoicesMailer < ApplicationMailer
  def company_invoice_notification(invoice_id, recipient)
    build_user(recipient)
    @invoice = find_invoice(invoice_id)

    attachments['invoice.csv'] = invoice_csv(@invoice)
    attachments['invoice.pdf'] = invoice_pdf(@invoice)

    mail to: @user.email,
      subject: "Gett Business Solutions powered by One Transport Invoice No.#{@invoice.id} - #{@invoice.billing_period_start.year}"
  end

  def passenger_invoice_notification(invoice_id, recipient)
    build_user(recipient)
    invoice = find_invoice(invoice_id)

    attachments['invoice.csv'] = invoice_csv(invoice)
    attachments['invoice.pdf'] = invoice_pdf(invoice)
    attachments['ride_details.zip'] = ride_details_zip(invoice)

    mail(
      to: @user.email,
      subject: "Your receipt for Invoice No.#{invoice.id}"
    )
  end

  def passenger_invoice_created_notification(invoice_id, recipient)
    build_user(recipient)
    invoice = find_invoice(invoice_id)

    attachments['invoice.csv'] = invoice_csv(invoice)
    attachments['invoice.pdf'] = invoice_pdf(invoice)

    mail(
      to: @user.email,
      subject: 'You have new invoice'
    )
  end

  def account_manager_outstanding_notification(invoice_id)
    @invoice = find_invoice(invoice_id)
    @company = @invoice.company
    @user = Hashie::Mash.new(enterprise: true)

    email = @company.account_manager_email
    email && mail(
      to: email,
      subject: "Payment for Invoice No.#{@invoice.id} is failed"
    )
  end

  def credit_note_notification(credit_note_id, recipient)
    build_user(recipient)
    credit_note = Invoice.with_pk!(credit_note_id)
    @company = credit_note.company

    attachments['credit_note.pdf'] = credit_note_pdf(credit_note)

    mail(to: @user.email, subject: 'Gett Business Solutions powered by One Transport - Credit Note')
  end

  def user_reminder(invoice_id, recipient)
    build_user(recipient)
    @invoice = find_invoice(invoice_id)

    mail(
      to: @user.email,
      subject: "REMINDER: #{@invoice.id} - #{@invoice.company.name} (#{@invoice.company.id}) is overdue"
    )
  end

  def company_reminder(invoice_id, recipient)
    build_user(recipient)
    @invoice = find_invoice(invoice_id)
    @thank_you = true

    mail(
      to: @user.email,
      subject: "REMINDER: Gett Business Solutions powered by One Transport Invoice No.#{@invoice.id} Due On #{@invoice.overdue_at.strftime('%A, %d %b %Y')}"
    )
  end

  def receipt(invoice_id, recipient)
    build_user(recipient)
    @invoice = find_invoice(invoice_id)

    mail(
      to: @user.email,
      subject: "Gett Business Solutions powered by One Transport Invoice No.#{@invoice.id} - Payment Received"
    )
  end

  private def find_invoice(invoice_id)
    Invoice.with_pk!(invoice_id)
  end

  private def build_user(recipient)
    @user = Hashie::Mash.new(recipient)
    @user.enterprise = true
  end

  private def invoice_csv(invoice)
    Invoices::Export.new(invoice: invoice).execute.result
  end

  private def invoice_pdf(invoice)
    ::Documents::Invoice.new(invoice: invoice, format: :pdf)
      .with_context(user: :system).execute.result
  end

  private def ride_details_zip(invoice)
    zip_path =
      Receipts::ZipBunch.new(passenger: invoice.member, bookings: invoice.bookings).execute.result

    File.read(zip_path)
  end

  private def credit_note_pdf(credit_note)
    ::Documents::CreditNote.new(credit_note: credit_note, format: :pdf)
      .with_context(user: :system).execute.result
  end
end
