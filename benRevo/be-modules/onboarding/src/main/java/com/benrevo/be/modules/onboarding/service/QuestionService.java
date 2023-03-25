package com.benrevo.be.modules.onboarding.service;

import com.benrevo.common.dto.QuestionDto;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.QuestionRepository;
import com.benrevo.common.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static com.benrevo.common.util.ValidationHelper.validateObjects;
import static com.benrevo.common.util.ObjectMapperUtils.*;

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional(readOnly = true)
    public QuestionDto getById(Long id) {
        Question question = questionRepository.findOne(id);

        if(question == null) {
            throw new NotFoundException("Question not found")
                .withFields(
                    field("question_id", id)
                );
        }

        return map(question, QuestionDto.class);
    }

    public List<QuestionDto> create(List<QuestionDto> dtoList) {
        validateObjects(dtoList);

        List<Question> questions = mapAll(dtoList, Question.class);

        return mapAll(questionRepository.save(questions), QuestionDto.class);
    }

    public List<QuestionDto> update(List<QuestionDto> dtoList) {
        validateObjects(dtoList);

        Map<Long, QuestionDto> idMap = mapToMap(dtoList, QuestionDto::getQuestionId, x -> x);

        List<Question> questions = questionRepository.findAll(idMap.keySet());

        if(questions == null) {
            throw new NotFoundException("No questions found")
                .withFields(
                    field("question_ids", idMap.keySet().toString())
                );
        }

        questions.forEach(
            x -> {
                QuestionDto dto = idMap.get(x.getQuestionId());
                x.setTitle(dto.getTitle());
                x.setMultiselectable(dto.isMultiselectable());
            }
        );

        return mapAll(questionRepository.save(questions), QuestionDto.class);
    }

    public void delete(List<Long> ids) {
        List<Question> questions = questionRepository.findAll(ids);

        if(questions == null) {
            throw new NotFoundException("No questions found")
                .withFields(
                    field("question_ids", ids.toString())
                );
        }

        questionRepository.delete(questions);
    }
}