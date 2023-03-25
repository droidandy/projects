class DeploymentNotification < Sequel::Model
  plugin :application_model

  def validate
    super
    validates_presence :text
  end

  def self.current_text
    last&.text
  end
end

# Table: deployment_notifications
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('deployment_notifications_id_seq'::regclass)
#  text       | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  deployment_notifications_pkey | PRIMARY KEY btree (id)
