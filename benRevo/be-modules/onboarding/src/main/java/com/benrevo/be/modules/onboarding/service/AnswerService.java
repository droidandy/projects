package com.benrevo.be.modules.onboarding.service;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.AnswerDto;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import com.google.common.base.CharMatcher;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static com.benrevo.common.util.ValidationHelper.validateObject;
import static java.lang.String.format;
import static java.util.stream.Collectors.toMap;

/**
 * TODO: Rework ValidationHelper logic (perhaps replace with hibernate/spring validator)
 */
@Service
@Transactional
public class AnswerService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Transactional(readOnly = true)
    public AnswerDto getById(Long id) {
        throw new UnsupportedOperationException();
    }

    public void createOrUpdate(AnswerDto dto) {
        // TODO: remove now that @CheckBrokerage is in the AnswerController
        validateObject(dto);

        Client client = clientRepository.findOne(dto.getClientId());

        isNotNull(
            client,
            format(
                // TODO: move the constants to a properties file?
                Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND_EXTENDED,
                Client.class.getSimpleName(),
                dto.getClientId()
            )
        );

        Long brokerId = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Broker loggedInBroker = brokerRepository.findOne(brokerId);

        if(loggedInBroker.isGeneralAgent()){
            ExtBrokerageAccess brokerageAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(brokerId, client.getBroker().getBrokerId());
            if(brokerageAccess == null){
                throw new NotFoundException("GA broker with brokerId="+ brokerId + " does not have access to client with clientId=" + dto
                    .getClientId());
            }
        }else{
            if(!Objects.equals(client.getBroker().getBrokerId(), brokerId)) {
                throw new NotAuthorizedException("Broker does not have access to this client")
                    .withFields(
                        field("broker_id", brokerId),
                        field("client_id", client.getClientId())
                    );
            }
        }

        removePreviousAnswers(dto, client.getClientId());

        List<Form> forms = formRepository.findAll();
        Map<String, Question> questionMap = new HashMap<>();
        forms.forEach(form -> {
            List<Question> questions = mapToList(form.getFormQuestions(), FormQuestion::getQuestion);
            questionMap.putAll(mapToMap(questions, Question::getCode, x -> x));
        });

        //create answers
        List<Answer> answers = dto.getAnswers() != null ? mapToList(dto.getAnswers().entrySet(),
                entry -> createAnswer(entry.getKey(), entry.getValue(), client, questionMap)) : new ArrayList<>();

        //create multi-answers
        if (dto.getMultiAnswers() != null) {
            dto.getMultiAnswers().entrySet().forEach(entry -> {
                if (entry.getValue() != null) {
                    Question question = questionMap.get(entry.getKey());
                    if (question != null && !question.isMultiselectable()) {
                        throw new ValidationException("The question doesn't allow multiple answers")
                                .withFields(
                                        field("key", question.getCode())
                                );
                    }

                    List<Answer> multiAnswers = mapToList(entry.getValue(), value -> createAnswer(entry.getKey(), value, client, questionMap));
                    answers.addAll(multiAnswers);
                }
            });
        }

        answerRepository.save(answers);
        
    }

    private void removePreviousAnswers(AnswerDto dto, Long clientId) {
        List<String> codes = dto.getAnswers() != null ? new ArrayList<>(dto.getAnswers().keySet()) : new ArrayList<>();
        if (dto.getMultiAnswers() != null) {
            codes.addAll(dto.getMultiAnswers().keySet());
        }

        answerRepository.deleteByClientClientIdAndQuestionCodeIn(clientId, codes);
    }

    private Answer createAnswer(String key, String value, Client client, Map<String, Question> questionMap) {
        Answer answer = new Answer();
        answer.setClient(client);

        Question q = questionMap.get(key);

        if(q != null) {
            answer.setQuestion(questionMap.get(key));
        } else {
            throw new NotFoundException("Question for key not found: " + key)
                .withFields(
                        field("key", key)
                );
        }
        
        // remove invisible control chars to prevent errors on processing (documents generation)
        value = CharMatcher.JAVA_ISO_CONTROL.removeFrom(value);
        
        answer.setValue(value);

        List<Variant> variants = questionMap.get(key).getVariants();

        boolean validatedVariant = variants == null || variants.isEmpty() ||
            variants.stream().anyMatch(variant -> variant.getOption().equalsIgnoreCase(answer.getValue()));

        if(!validatedVariant) {
            throw new ValidationException("Answer for question inappropriate")
                .withFields(
                        field("key", key)
                );
        }

        return answer;
    }

    public AnswerDto getAnswers(Long clientId) {
        Client client = clientRepository.findOne(clientId);

        isNotNull(client, format(Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND_EXTENDED, Client.class.getSimpleName(), clientId));

        Long brokerId = (Long) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getDetails();

        Broker loggedInBroker = brokerRepository.findOne(brokerId);
        if(loggedInBroker.isGeneralAgent()){
            ExtBrokerageAccess brokerageAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(brokerId, client.getBroker().getBrokerId());
            if(brokerageAccess == null){
                throw new NotFoundException("GA broker with brokerId="+ brokerId + " does not have access to client with clientId=" + clientId);
            }
        }else{
            if(!Objects.equals(client.getBroker().getBrokerId(), brokerId)) {
                throw new NotAuthorizedException("Broker does not have access to this client")
                    .withFields(
                        field("broker_id", brokerId),
                        field("client_id", client.getClientId())
                    );
            }
        }

        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(clientId);
        List<Answer> answers = answerRepository.findByClientClientId(clientId);
        Map<String, String> regularAnswers = answers.stream().filter(a -> !a.getQuestion().isMultiselectable()).collect(toMap(answer -> answer.getQuestion().getCode(), Answer::getValue));
        answerDto.setAnswers(regularAnswers);
        Map<String, List<String>> multiAnswers = new HashMap<>();
        answers.stream().filter(a -> a.getQuestion().isMultiselectable()).forEach(answer -> {
            if (!multiAnswers.containsKey(answer.getQuestion().getCode())){
                multiAnswers.put(answer.getQuestion().getCode(), new ArrayList<>());
            }
            multiAnswers.get(answer.getQuestion().getCode()).add(answer.getValue());
        });
        answerDto.setMultiAnswers(multiAnswers);
        if (client.getDateFormSubmitted() != null) {
            answerDto.setSubmittedDate(DateHelper.fromDateToString(client.getDateFormSubmitted(), Constants.DATETIME_FORMAT));
        }

        return answerDto;
    }

    public void delete(List<Long> ids) {
        answerRepository.delete(answerRepository.findAll(ids));
    }
}
