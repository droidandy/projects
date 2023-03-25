using Sequel::CoreRefinements

class Message < Sequel::Model
  plugin :application_model

  module AlertType
    SUCCESS = 'success'.freeze
    ERROR   = 'error'.freeze
    INFO    = 'info'.freeze
    WARNING = 'warning'.freeze
  end

  module MessageType
    DEPLOYMENT = 'deployment'.freeze
    EXTERNAL   = 'external'.freeze
    INTERNAL   = 'internal'.freeze
    PERSONAL   = 'personal'.freeze
    PUSH       = 'push'.freeze

    ALL_TYPES = [DEPLOYMENT, EXTERNAL, INTERNAL, PERSONAL, PUSH].freeze
  end

  many_to_one :sender, class: 'User' do |ds|
    ds.left_join(:members, id: :users[:id]).select_append(:users[:id].as(:id))
  end
  many_to_one :company

  many_to_one :recipient, class: 'User' do |ds|
    ds.left_join(:members, id: :users[:id]).select_append(:users[:id].as(:id))
  end

  MessageType::ALL_TYPES.each do |value|
    define_method("#{value}?") do
      message_type == value
    end
  end

  dataset_module do
    MessageType::ALL_TYPES.each do |value|
      scope(value) { where(message_type: value) }
    end

    scope(:external_and_deployment) { where(message_type: [MessageType::EXTERNAL, MessageType::DEPLOYMENT]) }
  end

  def validate
    super
    validates_presence(:body)
    validates_presence(:sender) if internal?
    validates_includes(MessageType::ALL_TYPES, :message_type, allow_nil: true)
  end

  def message_body
    push? ? data&.dig(:notification, :body) : body
  end

  def data
    return if !push? || body.blank?

    JSON.parse(body, symbolize_names: true)
  end
end

# Table: messages
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('messages_id_seq'::regclass)
#  sender_id    | integer                     |
#  company_id   | integer                     |
#  body         | text                        | NOT NULL
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
#  title        | text                        |
#  recipient_id | integer                     |
#  message_type | text                        |
# Indexes:
#  messages_pkey               | PRIMARY KEY btree (id)
#  messages_company_id_index   | btree (company_id)
#  messages_message_type_index | btree (message_type)
# Foreign key constraints:
#  messages_company_id_fkey   | (company_id) REFERENCES companies(id)
#  messages_recipient_id_fkey | (recipient_id) REFERENCES users(id)
#  messages_sender_id_fkey    | (sender_id) REFERENCES users(id)
