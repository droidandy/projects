package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long>, AnswerRepositoryCustom {
    List<Answer> deleteByClientClientIdAndQuestionCodeIn(Long clientId, List<String> codes);

    List<Answer> findByClientClientId(Long clientId);

    @Query("select a.value from Answer a inner join a.question q where a.client.clientId = :clientId and q.code = :code")
    String findAnswerByClientIdAndCode(@Param("clientId") Long clientId, @Param("code") String code);

}
