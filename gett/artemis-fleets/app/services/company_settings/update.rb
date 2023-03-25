module CompanySettings
  class Update
    def initialize(member, params)
      @user = member
      @company = member.company
      @params = params
    end

    attr_reader :success, :errors

    def execute!
      return unless action_allowed
      Company.transaction do
        update_primary_contact
        update_billing_contact
      end
      @success = true
      rescue ActiveRecord::RecordInvalid => e
        @success = false
        @errors = e.record.errors
    end

    private def update_primary_contact
      return if @params[:primary_contact].blank?
      contact = @company.primary_contact || Contact.new
      contact.update!(@params[:primary_contact].except(:address))

      if @params[:primary_contact][:address].present?
        address = contact.address || Address.new
        address.update!(@params[:primary_contact][:address])
        contact.update!(address: address)
      end

      @company.update!(primary_contact: contact)
    end

    private def update_billing_contact
      return if @params[:billing_contact].blank?
      contact = @company.billing_contact || Contact.new
      contact.update!(@params[:billing_contact].except(:address))

      if @params[:billing_contact][:address].present?
        address = contact.address || Address.new
        address.update!(@params[:billing_contact][:address])
        contact.update!(address: address)
      end

      @company.update!(billing_contact: contact)
    end

    private def action_allowed
      return true if @user.admin?
      @error = 'permission denied'
      @success = false
    end
  end
end
