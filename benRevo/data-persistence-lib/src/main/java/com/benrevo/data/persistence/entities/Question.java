package com.benrevo.data.persistence.entities;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;

    @Column	(name = "code", unique = true)
    private String code;

    @Column	(name = "title")
    private String title;

    @Column (name = "multiselectable")
    private boolean multiselectable;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "question", cascade = CascadeType.ALL)
    private List<Variant> variants;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isMultiselectable() {
        return multiselectable;
    }

    public void setMultiselectable(boolean multiselectable) {
        this.multiselectable = multiselectable;
    }

    public List<Variant> getVariants() {
        return variants;
    }

    public void setVariants(List<Variant> variants) {
        this.variants = variants;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Question)) return false;

        Question question = (Question) o;

        if (multiselectable != question.multiselectable) return false;
        if (!code.equals(question.code)) return false;
        if (!questionId.equals(question.questionId)) return false;
        if (!title.equals(question.title)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = questionId.hashCode();
        result = 31 * result + code.hashCode();
        result = 31 * result + title.hashCode();
        result = 31 * result + (multiselectable ? 1 : 0);
        return result;
    }
}