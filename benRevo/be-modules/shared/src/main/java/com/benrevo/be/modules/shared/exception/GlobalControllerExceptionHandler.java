package com.benrevo.be.modules.shared.exception;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.exception.*;
import com.benrevo.common.logging.CustomLogger;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.handler.HandlerExceptionResolverComposite;

import static java.lang.String.format;
import static java.util.stream.Collectors.toMap;
import static org.apache.commons.lang3.ArrayUtils.addAll;

/**
 * TODO: Modify this to obfuscate the publicly viewable message and only log full details to
 * log4j/splunk.
 */
@ControllerAdvice
public class GlobalControllerExceptionHandler extends HandlerExceptionResolverComposite {

    static final String SERVER_ERROR = "There was an issue with your request. Please try again.";

    @ExceptionHandler({
        NotFoundException.class,
        BadRequestException.class,
        NotAuthorizedException.class,
        DocumentGeneratorException.class,
        ClientException.class,
        BaseException.class
    })
    public ResponseEntity<RestMessageDto> handle(BaseException e, HandlerMethod hm) {
        return returnError(e.getMessage(), HttpStatus.valueOf(e.getStatus()), e, hm);
    }

    @ExceptionHandler({
        URISyntaxException.class,
        ValidationException.class
    })
    public ResponseEntity<RestMessageDto> handle(URISyntaxException e, HandlerMethod hm) {
        return returnError(e.getMessage(), HttpStatus.BAD_REQUEST, e, hm);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestMessageDto> handle(
        MethodArgumentNotValidException e,
        HandlerMethod hm
    ) {
        List<FieldError> allErrors = e.getBindingResult().getFieldErrors();

        Map<String, Object> errorMap = allErrors.stream()
            .collect(toMap(
                FieldError::getField,
                DefaultMessageSourceResolvable::getDefaultMessage
            ));

        String message = format(
            "Bad request: %s has %s error(s)",
            e.getBindingResult().getObjectName(),
            errorMap != null ? errorMap.size() : 0
        );

        return returnError(message, HttpStatus.BAD_REQUEST, e, hm, errorMap);
    }

    @ExceptionHandler(HttpMediaTypeException.class)
    public ResponseEntity<RestMessageDto> handle(HttpMediaTypeException e, HandlerMethod hm) {
        return returnError(e.getMessage(), HttpStatus.UNSUPPORTED_MEDIA_TYPE, e, hm);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RestMessageDto> handle(IllegalArgumentException e, HandlerMethod hm) {
        return returnError(e.getMessage(), HttpStatus.BAD_REQUEST, e, hm);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RestMessageDto> handle(
        HttpMessageNotReadableException e,
        HandlerMethod hm
    ) {
        return returnError(e.getMessage(), HttpStatus.BAD_REQUEST, e, hm);
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<RestMessageDto> handle(JWTVerificationException e, HandlerMethod hm) {
        return returnError(e.getMessage(), HttpStatus.UNAUTHORIZED, e, hm);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<RestMessageDto> handle(
        org.springframework.security.access.AccessDeniedException e,
        HandlerMethod hm
    ) {
        return returnError(e.getMessage(), HttpStatus.FORBIDDEN, e, hm);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestMessageDto> handle(Exception e, HandlerMethod hm) {
        return returnError(e.getMessage() != null ? e.getMessage() : SERVER_ERROR,
                           HttpStatus.INTERNAL_SERVER_ERROR, e, hm
        );
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public String handle() {
        return "/index";
    }

    /**
     * Convenience method for logging an exception and returning the appropriate {@link
     * ResponseEntity}.
     *
     * @param message
     *     The error message to return to the front-end
     * @param status
     *     The status code to return.
     * @param exception
     *     The exception.
     * @param <E>
     *     The exception type.
     * @param hm
     *     The {@link HandlerMethod} to retrieve the calling class type.
     *
     * @return new {@link ResponseEntity}
     */
    <E extends Throwable> ResponseEntity<RestMessageDto> returnError(
        String message,
        HttpStatus status, E exception, HandlerMethod hm, Map<String, Object> errors
    ) {
        try {
            CustomLogger logger = CustomLogger.create();

            RestMessageDto respBody = new RestMessageDto(message);

            // Grab method name if available
            if(hm != null && hm.getBeanType() != null) {
                ThreadContext.put("method", hm.getShortLogMessage());
                logger = CustomLogger.create(hm.getBeanType().getCanonicalName());

                if(hm.getShortLogMessage() != null
                   && hm.getShortLogMessage().contains("com.benrevo.be.modules.admin")) {
                    respBody.setClientMessage(true);
                }
            }

            if(errors != null && errors.size() > 0) {
                respBody.setErrors(errors);
            }

            if(exception instanceof ClientException) {
                respBody.setClientMessage(true);
            }

            Pair<String, Object>[] errorPairs = null;

            if(exception instanceof BaseException) {
                errorPairs = addAll(
                    ((BaseException) exception).getFieldsAsArray(),
                    errors != null ? (Pair[]) errors.entrySet().stream()
                        .map(eo -> Pair.of(eo.getKey(), eo.getValue())).toArray() : null
                );
            }

            if(errorPairs != null) {
                logger.errorLog(message, exception, errorPairs);
            } else {
                logger.errorLog(message, exception);
            }

            return new ResponseEntity<>(respBody, status);
        } finally {
            ThreadContext.remove("method");
        }
    }

    <E extends Throwable> ResponseEntity<RestMessageDto> returnError(
        String message,
        HttpStatus status, E exception, HandlerMethod hm
    ) {
        return returnError(message, status, exception, hm, null);
    }
}
