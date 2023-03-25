using Sequel::CoreRefinements

module Admin::Invoices
  class Index < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :query

    def self.policy_class
      Admin::Invoices::IndexPolicy
    end

    def execute!
      {
        items: invoice_items,
        outstanding_debt: outstanding_debt,
        history: history,
        pagination: {
          current: invoices_dataset.current_page,
          total: invoices_dataset.pagination_record_count
        }
      }
    end

    private def invoice_items
      invoices_dataset.all.map do |invoice|
        Admin::Invoices::Show.new(invoice: invoice).execute.result
      end
    end

    private def outstanding_debt
      history_invoices_dataset.get{ sum(:amount_cents) - sum(:paid_amount_cents) }
    end

    private def history
      total_history.keys.sort.map do |month|
        {
          name: month.strftime('%b'),
          total: total_history.fetch(month, []).sum(&:amount_cents).to_f / 100,
          collected: total_history.fetch(month, []).sum(&:paid_amount_cents).to_f / 100
        }
      end
    end

    private def total_history
      @total_history ||=
        history_invoices_dataset.all.group_by do |invoice|
          invoice.created_at.beginning_of_month
        end
    end

    private def invoices_dataset
      @invoices_dataset ||= Query
        .new(query, scope: Invoice.order(Sequel.desc(:id))).resolved_scope
        .eager(:paid_by, :created_by, company: :company_info)
    end

    private def history_invoices_dataset
      if query[:company_id]
        Invoice.billing.where(company_id: query[:company_id])
      else
        Invoice.billing
      end
    end

    class Query < ::Parascope::Query
      defaults page: 1, per_page: 10

      query_by(:company_id) do |company_id|
        scope.where(company_id: company_id)
      end

      query_by(:type) do |type|
        scope.where(type: type)
      end

      query_by(:status) do |status|
        if %w(paid partially_paid not_paid outstanding overdue
              outstanding_without_processing overdue_without_processing processing
              issued applied under_review).include?(status)
          scope.public_send(status)
        end
      end

      query_by(:from_date) do |date|
        scope.where{ created_at >= Date.parse(date).beginning_of_day }
      end

      query_by(:to_date) do |date|
        scope.where{ created_at <= Date.parse(date).end_of_day }
      end

      query_by(:overdue_by) do |overdue_by|
        scope.overdue.where{ overdue_at <= (overdue_by.to_i - 1).days.ago }
      end

      query_by(:invoice_id) do |invoice_id|
        scope.where(id: invoice_id)
      end

      query_by(:page, :per_page) do |page, per_page|
        scope.paginate(page.to_i, per_page.to_i)
      end
    end
  end
end
