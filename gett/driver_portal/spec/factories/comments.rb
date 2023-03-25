# == Schema Information
#
# Table name: comments
#
#  id               :bigint(8)        not null, primary key
#  user_id          :bigint(8)
#  commentable_id   :bigint(8)
#  commentable_type :string
#  content          :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  parent_id        :bigint(8)
#  likes_count      :integer          default(0)
#  dislikes_count   :integer          default(0)
#

FactoryBot.define do
  factory :comment do
    user
    commentable { create :news_item }
    sequence(:content) { |i| "Comment ##{i}" }

    transient do
      subcomments_count 0
    end

    after(:create) do |comment, evaluator|
      create_list :comment, evaluator.subcomments_count, commentable: comment
    end
  end
end
