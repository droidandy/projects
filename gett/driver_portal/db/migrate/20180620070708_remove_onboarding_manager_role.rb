class RemoveOnboardingManagerRole < ActiveRecord::Migration[5.1]
  def up
    execute <<-SQL
      update users_roles
      set role_id = (
        select id
        from roles
        where name = 'onboarding_agent'
      ) where role_id = (
        select id
        from roles
        where name = 'onboarding_manager'
      )
    SQL

    execute <<-SQL
      delete from roles_permissions
      where role_id = (
        select id
        from roles
        where name = 'onboarding_manager'
      )
    SQL

    execute "delete from roles where name = 'onboarding_manager'"
  end
end
