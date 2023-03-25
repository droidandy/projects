# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180620070708) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "agent_statuses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "status", null: false
    t.boolean "current", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "ended_at"
    t.index ["user_id"], name: "index_agent_statuses_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "commentable_id"
    t.string "commentable_type"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "parent_id"
    t.integer "likes_count", default: 0
    t.integer "dislikes_count", default: 0
    t.index ["commentable_id", "commentable_type"], name: "index_comments_on_commentable_id_and_commentable_type"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "documents", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "kind_id"
    t.string "file"
    t.boolean "hidden", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "vehicle_id"
    t.string "content_type"
    t.string "file_name"
    t.jsonb "metadata", default: {}, null: false
    t.integer "approval_status", default: 0, null: false
    t.datetime "expires_at"
    t.integer "gett_id"
    t.datetime "started_at"
    t.string "unique_id"
    t.bigint "agent_id"
    t.index ["agent_id"], name: "index_documents_on_agent_id"
    t.index ["kind_id"], name: "index_documents_on_kind_id"
    t.index ["user_id"], name: "index_documents_on_user_id"
    t.index ["vehicle_id"], name: "index_documents_on_vehicle_id"
  end

  create_table "documents_fields", force: :cascade do |t|
    t.bigint "kind_id"
    t.string "label"
    t.string "name"
    t.string "field_type"
    t.boolean "mandatory", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kind_id"], name: "index_documents_fields_on_kind_id"
  end

  create_table "documents_kinds", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.boolean "mandatory", default: false, null: false
    t.string "owner"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "definition_class"
  end

  create_table "documents_status_changes", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "document_id"
    t.string "status"
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["document_id"], name: "index_documents_status_changes_on_document_id"
    t.index ["user_id"], name: "index_documents_status_changes_on_user_id"
  end

  create_table "invites", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "sender_id"
    t.datetime "accepted_at"
    t.datetime "expires_at"
    t.string "token_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "step", default: 0, null: false
    t.index ["sender_id"], name: "index_invites_on_sender_id"
    t.index ["token_digest"], name: "index_invites_on_token_digest", unique: true
    t.index ["user_id"], name: "index_invites_on_user_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "likeable_id"
    t.string "likeable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "value", default: 1, null: false
    t.index ["likeable_id", "likeable_type"], name: "index_likes_on_likeable_id_and_likeable_type"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "logins", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_logins_on_user_id"
  end

  create_table "news_images", force: :cascade do |t|
    t.bigint "news_item_id"
    t.string "image"
    t.string "binding_hash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["news_item_id"], name: "index_news_images_on_news_item_id"
  end

  create_table "news_items", force: :cascade do |t|
    t.string "title"
    t.string "image"
    t.text "content"
    t.datetime "published_at"
    t.bigint "author_id"
    t.string "item_type"
    t.integer "comments_count", default: 0
    t.float "number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "views_count", default: 0
    t.integer "trending_index", default: 0, null: false
    t.index ["author_id"], name: "index_news_items_on_author_id"
  end

  create_table "permissions", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_permissions_on_slug"
  end

  create_table "review_updates", force: :cascade do |t|
    t.bigint "review_id", null: false
    t.bigint "reviewer_id", null: false
    t.integer "requirement", null: false
    t.boolean "completed"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "current", default: true, null: false
    t.index ["review_id"], name: "index_review_updates_on_review_id"
    t.index ["reviewer_id"], name: "index_review_updates_on_reviewer_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "driver_id", null: false
    t.boolean "completed"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "attempt_number", default: 1, null: false
    t.datetime "scheduled_at"
    t.datetime "checkin_at"
    t.datetime "training_start_at"
    t.datetime "training_end_at"
    t.datetime "identity_checked_at"
    t.datetime "assigned_at"
    t.integer "agent_id"
    t.index ["driver_id"], name: "index_reviews_on_driver_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "roles_permissions", id: false, force: :cascade do |t|
    t.bigint "role_id"
    t.bigint "permission_id"
    t.index ["permission_id"], name: "index_roles_permissions_on_permission_id"
    t.index ["role_id", "permission_id"], name: "index_roles_permissions_on_role_id_and_permission_id"
    t.index ["role_id"], name: "index_roles_permissions_on_role_id"
  end

  create_table "statements", force: :cascade do |t|
    t.bigint "user_id"
    t.string "external_id"
    t.string "pdf"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_statements_on_user_id"
  end

  create_table "statistics_entries", force: :cascade do |t|
    t.date "date"
    t.integer "active_users", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "login_count", default: 0
  end

  create_table "user_metrics", force: :cascade do |t|
    t.bigint "user_id"
    t.float "rating", default: 0.0
    t.float "today_acceptance", default: 0.0
    t.float "week_acceptance", default: 0.0
    t.float "month_acceptance", default: 0.0
    t.float "total_acceptance", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_metrics_on_user_id"
  end

  create_table "user_stats", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "completed_orders", default: 0
    t.integer "cancelled_orders", default: 0
    t.float "cash_fare", default: 0.0
    t.float "card_fare", default: 0.0
    t.float "tips", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_stats_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "gett_id"
    t.string "phone"
    t.string "address"
    t.string "city"
    t.string "postcode"
    t.string "account_number"
    t.string "sort_code"
    t.string "badge_number"
    t.string "vehicle_colour"
    t.string "vehicle_type"
    t.string "vehicle_reg"
    t.string "reset_password_digest"
    t.datetime "blocked_at"
    t.string "avatar"
    t.string "badge_type"
    t.string "license_number"
    t.boolean "is_frozen", default: false, null: false
    t.string "hobbies"
    t.string "talking_topics"
    t.date "driving_cab_since"
    t.string "disability_type"
    t.string "disability_description"
    t.date "birth_date"
    t.integer "approval_status", default: 0, null: false
    t.bigint "approver_id"
    t.datetime "ready_for_approval_since"
    t.string "how_did_you_hear_about"
    t.integer "onboarding_step", default: 0, null: false
    t.datetime "onboarding_failed_at"
    t.decimal "other_rating", precision: 3, scale: 2
    t.integer "vehicle_reg_year"
    t.string "insurance_number"
    t.boolean "insurance_number_agreement", default: false, null: false
    t.boolean "documents_agreement", default: false, null: false
    t.boolean "appointment_scheduled", default: false, null: false
    t.boolean "documents_uploaded", default: false, null: false
    t.string "gett_phone"
    t.string "avatar_filename"
    t.integer "min_rides_number"
    t.index ["approver_id"], name: "index_users_on_approver_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["ready_for_approval_since"], name: "index_users_on_ready_for_approval_since"
    t.index ["reset_password_digest"], name: "index_users_on_reset_password_digest"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "vehicles", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.string "model"
    t.string "color"
    t.string "plate_number"
    t.boolean "is_current", default: false, null: false
    t.boolean "hidden", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "approval_status", default: 0, null: false
    t.integer "gett_id"
    t.index ["user_id"], name: "index_vehicles_on_user_id"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "views", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "viewable_id"
    t.string "viewable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_views_on_user_id"
    t.index ["viewable_id", "viewable_type"], name: "index_views_on_viewable_id_and_viewable_type"
  end

end
