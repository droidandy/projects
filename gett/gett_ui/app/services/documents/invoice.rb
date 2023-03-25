using Sequel::CoreRefinements

module Documents
  class Invoice < ApplicationService
    include ApplicationService::DocumentRenderer
    include ApplicationService::Context
    include ApplicationService::Policy

    DATE_FORMAT = '%-d %b %Y'.freeze

    # if invoice is passed directly, policy_scope is ignored
    attributes :invoice, :invoice_id

    delegate :company, to: :invoice
    delegate :admin, to: :company

    def self.policy_class
      if context&.back_office?
        Admin::Documents::InvoicePolicy
      else
        ::Documents::InvoicePolicy
      end
    end

    pdf_options(orientation: 'Landscape')

    def render_pdf
      title_page = super
      content_pages = render_bookings_pdf

      Dir.mktmpdir do |dir|
        title_file = File.join(dir, 'title.pdf')
        content_file = File.join(dir, 'content.pdf')
        output_file = File.join(dir, 'invoice.pdf')

        File.open(title_file, 'wb') { |file| file.write(title_page) }
        File.open(content_file, 'wb') { |file| file.write(content_pages) }

        `pdftk #{title_file} #{content_file} cat output #{output_file}`

        File.read(output_file)
      end
    end

    private def template_assigns
      {
        company:             company,
        contact:             admin,
        invoice:             invoice,
        invoice_date:        invoice_date,
        invoice_period:      invoice_period,
        invoice_due_date:    invoice_due_date,
        invoice_status:      invoice_status,
        number_of_jobs:      number_of_jobs,
        net_vatable:         net_vatable,
        net_non_vatable:     net_non_vatable,
        vat:                 vat,
        total:               total,
        promotions:          invoice.business_credit_cents,
        due:                 invoice.amount_cents,
        support_phone:       company.ddi_phone
      }
    end

    private def render_bookings_pdf
      WickedPdf.new.pdf_from_string(
        render_bookings_html,
        pdf_options.merge(
          footer: { content: render_footer_html },
          margin: { top: 0, bottom: 14, left: 0, right: 0 }
        )
      )
    end

    private def render_bookings_html
      DocumentsController.render(
        template: 'documents/invoice_bookings',
        layout: 'layouts/document',
        assigns: {
          bookings: decorated_bookings,
          _format: :pdf
        }
      )
    end

    private def render_footer_html
      DocumentsController.render(
        template: 'documents/invoice_footer',
        assigns: {
          invoice_number: invoice.id,
          invoice_date: invoice_date,
          _format: :pdf
        }
      )
    end

    private def bookings
      @bookings ||= invoice.bookings_dataset
        .select(:bookings.*)
        .association_join(:charges)
        .where{ (:charges[:total_cost] > 0) | (:bookings[:status] =~ 'completed') }
        .order(:scheduled_at)
        .eager(:vehicle, :charges, :booker_references, :passenger)
        .all
    end

    private def number_of_jobs
      decorated_bookings.count
    end

    private def net_vatable
      decorated_bookings.sum do |booking|
        booking.vatable_ride_fees + booking.vatable_extra_fees + booking.service_fees
      end
    end

    private def net_non_vatable
      decorated_bookings.sum do |booking|
        booking.non_vatable_ride_fees + booking.non_vatable_extra_fees
      end
    end

    private def vat
      decorated_bookings.sum(&:vat)
    end

    private def total
      decorated_bookings.sum(&:total_cost)
    end

    private def invoice
      @invoice ||= attributes[:invoice] || policy_scope.with_pk!(invoice_id)
    end

    private def decorated_bookings
      @decorated_bookings ||= bookings.map { |b| InvoiceBookingDecorator.new(b) }
    end

    private def invoice_period
      start_date = invoice.billing_period_start.in_time_zone(Settings.time_zone).strftime(DATE_FORMAT)
      end_date = invoice.billing_period_end.in_time_zone(Settings.time_zone).strftime(DATE_FORMAT)
      "from #{start_date} to #{end_date}"
    end

    private def invoice_date
      invoice.created_at.in_time_zone(Settings.time_zone).strftime(DATE_FORMAT)
    end

    private def invoice_due_date
      invoice.overdue_at.in_time_zone(Settings.time_zone).strftime(DATE_FORMAT)
    end

    private def invoice_status
      I18n.t("invoices.status.#{invoice.status}")
    end

    def filename
      "invoice#{invoice.id}"
    end
  end
end
