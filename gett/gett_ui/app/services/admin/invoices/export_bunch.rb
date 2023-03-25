module Admin::Invoices
  class ExportBunch < Shared::Invoices::ExportBunch
    attributes :periods, :user
    background_attributes :periods, :user, :company

    def self.policy_class
      Admin::Invoices::Policy
    end

    # Dirty hack to fix issue with `background_attributes` sharing across inherited classes
    def company
      nil
    end

    private def download_path
      Rails.application.routes.url_helpers.download_bunch_admin_invoices_path(filename: zip_basename)
    end

    private def execute_args
      { periods: periods, user: fetch_user }
    end

    private def fetch_user
      context.admin
    end

    private def invoices_dataset
      Invoice
    end
  end
end
