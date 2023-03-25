package com.benrevo.common.util;

import com.benrevo.common.exception.ValidationException;
import org.apache.commons.validator.routines.EmailValidator;
import org.hibernate.validator.HibernateValidator;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Stream;

import static com.benrevo.common.util.StreamUtils.mapToList;

/**
 * Created by ojas.sitapara on 1/11/17.
 */
public class ValidationHelper {

    private static Validator validator = Validation
            .byProvider(HibernateValidator.class)
            .configure()
            .buildValidatorFactory()
            .getValidator();

    private ValidationHelper() {
    }

    private enum Datatypes {
        INTEGER, DECIMAL, BOOLEAN, TEXT;
    }

    public static Validator getValidator() {
        return validator;
    }

    public static boolean isEmailValid(String email) {
        return EmailValidator.getInstance().isValid(email);
    }

    public static boolean isValueMatchDatatype(String value, String datatype) {
        boolean isValid = false;
        Datatypes validDatatype;

        try {
            validDatatype = Datatypes.valueOf(datatype);
        } catch (IllegalArgumentException e) {
            return isValid;
        }

        switch(validDatatype) {
            case INTEGER:
                try {
                    Integer.parseInt(value);
                    isValid = true;
                } catch (NumberFormatException e) {
                    //do nothing
                }
                break;
            case DECIMAL:
                try {
                    Double.parseDouble(value);
                    isValid = true;
                } catch (NumberFormatException e) {
                    //do nothing
                }
                break;
            case BOOLEAN:
                isValid = Boolean.parseBoolean(value);
                break;
            case TEXT:
                isValid = true;
                break;
            default:
                break;
        }
        return isValid;
    }

    /**
     * Throws ValidationException exception if the element is null.
     * @param message the message of exception
     */
    public static void isNotNull(Object object, String message) {
        if (object == null) {
            throw new ValidationException(message);
        }
    }

    /**
     * Throws ValidationException exception if any element is null.
     * @param message the message of exception
     */
    public static void isNotNull(Object[] objects, String message) {
        Stream.of(objects).forEach(x -> isNotNull(x, message));
    }

    /**
     * Throws ValidationException exception if the array is empty.
     * @param message the message of exception
     */
    public static void isNotEmpty(Object[] objects, String message) {
        if (objects.length == 0) {
            throw new ValidationException(message);
        }
    }

    /**
     * Validates {@code object} by an instance of {@link Validator}.
     * Throws {@link ValidationException} if at least one constraint violation is exist.
     *
     * @param object the object to check
     * @param <T>    the type of {@code object}
     */
    public static <T> void validateObject(T object) {
        Set<ConstraintViolation<T>> constraintViolations = validator.validate(object);
        if (!constraintViolations.isEmpty()) {
            Collection<String> messages = mapToList(constraintViolations, ConstraintViolation::getMessage);
            String constraintViolation = String.join("\n", messages);
            String message =
                    String.format("%s object is invalid. ErrorMessagePredicate violations: %s",
                            object.getClass().getName(),
                            constraintViolation);
            throw new ValidationException(message);
        }
    }

    public static <T> void validateObjects(Collection<T> objects) {
        objects.forEach(ValidationHelper::validateObject);
    }
}