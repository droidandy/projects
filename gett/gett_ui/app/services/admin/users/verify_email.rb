module Admin::Users
  class VerifyEmail < ApplicationService
    attributes :id, :email

    def execute!
      return { verified: true } if id.present? && user&.id == id.to_i

      if user&.member? && !user&.back_office?
        if user.company.active? && user.enterprise?
          if id.present?
            {
              verified: false,
              error: I18n.t('services.admin.users.verify_email.front_office_taken')
            }
          else
            {
              verified: true,
              member: member_data,
              message: I18n.t('services.admin.users.verify_email.front_office_taken')
            }
          end
        else
          {
            verified: false,
            error: I18n.t('services.admin.users.verify_email.cannot_be_used')
          }
        end
      elsif user.present?
        {
          verified: false,
          error: I18n.t('services.admin.users.verify_email.back_office_taken')
        }
      else
        {
          verified: true,
          message: I18n.t('services.admin.users.verify_email.email_is_free')
        }
      end
    end

    private def user
      return @user if defined? @user

      @user = User.first(email: email.downcase)
    end

    private def member_data
      user.as_json(only: [:email, :company_id, :first_name, :last_name, :phone]).merge(
        member_role_type: user.role.name
      )
    end
  end
end
