package com.benrevo.be.modules.onboarding.service;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateFormDto;
import com.benrevo.common.dto.FormDto;
import com.benrevo.common.dto.ShortQuestionDto;
import com.benrevo.common.dto.UpdateFormDto;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.FormRepository;
import com.benrevo.data.persistence.repository.QuestionRepository;
import com.benrevo.common.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static com.benrevo.common.util.StreamUtils.mapToSet;
import static com.benrevo.common.util.ObjectMapperUtils.*;
import static com.benrevo.common.util.ValidationHelper.*;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static java.util.stream.Collectors.*;

@Service
@Transactional
public class FormService {

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional(readOnly = true)
    public FormDto getById(Long id) {
        validateObject(id);

        Form form = formRepository.findOne(id);

        if(form == null) {
            throw new NotFoundException("No form found")
                .withFields(
                    field("form_id", id)
                );
        }

        return map(form, FormDto.class);
    }

    public List<FormDto> create(List<CreateFormDto> dtoList) {
        validateObjects(dtoList);

        Set<Long> carrierIds = mapToSet(dtoList, CreateFormDto::getCarrierId);

        List<Carrier> carriers = carrierRepository.findAll(carrierIds);

        validate(carriers, carrierIds.size());

        Map<Long, Carrier> carrierMap = mapToMap(carriers, Carrier::getCarrierId, x -> x);

        Map<Long, Boolean> requiredQuestionMap = dtoList.stream()
            .map(CreateFormDto::getQuestions)
            .flatMap(Collection::stream)
            .collect(
                toMap(
                    ShortQuestionDto::getQuestionId,
                    ShortQuestionDto::isRequired
                )
            );

        List<Question> questions = questionRepository.findAll(requiredQuestionMap.keySet());

        validate(questions, requiredQuestionMap.keySet().size());

        Map<Long, Question> questionMap = mapToMap(questions, Question::getQuestionId, x -> x);

        List<Form> forms = dtoList.stream()
            .map(
                dto -> {
                    Form form = new Form();
                    form.setCarrier(carrierMap.get(dto.getCarrierId()));
                    form.setName(dto.getName());

                    List<FormQuestion> formQuestions = dto.getQuestions().stream()
                        .distinct()
                        .map(
                            shortQuestionDto -> {
                                FormQuestion formQuestion = new FormQuestion();
                                formQuestion.setForm(form);
                                formQuestion.setQuestion(questionMap.get(shortQuestionDto.getQuestionId()));
                                formQuestion.setRequired(shortQuestionDto.isRequired());

                                return formQuestion;
                            }
                        )
                        .collect(toList());

                    form.setFormQuestions(formQuestions);

                    return form;
                }
            )
            .collect(toList());

        return mapAll(formRepository.save(forms), FormDto.class);
    }

    public List<FormDto> update(List<UpdateFormDto> dtoList) {
        validateObjects(dtoList);

        // Search for forms and validate request DTOs
        Set<Long> formIds = mapToSet(dtoList, UpdateFormDto::getFormId);

        List<Form> forms = formRepository.findAll(formIds);

        validate(forms, formIds.size());

        Map<Long, Form> formMap = mapToMap(forms, Form::getFormId, x -> x);

        Set<Long> carrierIds = mapToSet(dtoList, CreateFormDto::getCarrierId);

        List<Carrier> carriers = carrierRepository.findAll(carrierIds);

        validate(carriers, carrierIds.size());

        Map<Long, Carrier> carrierMap = mapToMap(carriers, Carrier::getCarrierId, x -> x);

        Map<Long, Boolean> requiredQuestionMap = dtoList.stream()
            .map(CreateFormDto::getQuestions)
            .flatMap(Collection::stream)
            .collect(
                toMap(
                    ShortQuestionDto::getQuestionId,
                    ShortQuestionDto::isRequired
                )
            );

        List<Question> questions = questionRepository.findAll(requiredQuestionMap.keySet());

        validate(questions, requiredQuestionMap.keySet().size());

        Map<Long, Question> questionMap = mapToMap(questions, Question::getQuestionId, x -> x);

        dtoList.forEach(
            dto -> {
                Form form = formMap.get(dto.getFormId());
                form.setName(dto.getName());
                form.setCarrier(carrierMap.get(dto.getCarrierId()));

                Map<Long, Boolean> requiredShortQuestionMap = mapToMap(dto.getQuestions(), ShortQuestionDto::getQuestionId, ShortQuestionDto::isRequired);
                List<FormQuestion> formQuestions = form.getFormQuestions();

                //remove old form questions
                List<FormQuestion> formQuestionsToRemove = new ArrayList<>();

                formQuestions.forEach(
                    x -> {
                        if(!requiredShortQuestionMap.keySet().contains(x.getQuestion().getQuestionId())) {
                            formQuestionsToRemove.add(x);
                        }
                    }
                );

                formQuestions.removeAll(formQuestionsToRemove);

                Set<Long> existingQuestionIds = formQuestions.stream()
                    .map(x -> x.getQuestion().getQuestionId())
                    .collect(toSet());

                List<Long> newQuestionIds = requiredShortQuestionMap.keySet().stream()
                    .filter(x -> !existingQuestionIds.contains(x))
                    .collect(toList());

                List<FormQuestion> newFormQuestions = newQuestionIds.stream()
                    .map(
                        x -> {
                            FormQuestion formQuestion = new FormQuestion();
                            formQuestion.setForm(form);
                            formQuestion.setQuestion(questionMap.get(x));
                            formQuestion.setRequired(requiredShortQuestionMap.get(x));

                            return formQuestion;
                        }
                    ).collect(toList());

                formQuestions.addAll(newFormQuestions);

                form.setFormQuestions(formQuestions);
            }
        );

        return mapAll(formRepository.save(forms), FormDto.class);
    }

    public void delete(List<Long> ids) {
        List<Form> forms = formRepository.findAll(ids);

        if(forms == null) {
            throw new NotFoundException("No form(s) found")
                .withFields(
                    field("form_ids", String.valueOf(ids))
                );
        }

        formRepository.delete(forms);
    }

    static void validate(List<?> objects, int validQuantity) {
        isNotNull(objects, Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND);

        if(validQuantity > 0) {
            isNotEmpty(objects.toArray(), Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND);
        }

        isNotNull(objects.toArray(), Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND);

        if(objects.size() != validQuantity) {
            throw new ValidationException(Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND);
        }
    }
}