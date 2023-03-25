package com.benrevo.common.enums;

public enum FormType {
    QUESTIONNAIRE("questionnaire"),
    EMPLOYER_APPLICATION_OTHER("group-application-other"),
    EMPLOYER_APPLICATION("employer-application"),
    ANTHEM_QUESTIONNAIRE("anthem-blue-cross-questionnaire"),
    ANTHEM_EMPLOYER_ACCESS("anthem-employer-access"),
    ANTHEM_EMPLOYER_APPLICATION("anthem-blue-cross-employer-application"),
    ANTHEM_KIT_REQUESTS("kit_requests"),
    ANTHEM_COMMON_OWNERSHIP("anthem-common-ownership");

    FormType(String message) {
        this.message = message;
    }

    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static FormType findByName(String name) {
        for (FormType type : FormType.values()) {
            if (type.getMessage().equalsIgnoreCase(name)) {
                return type;
            }
        }
        return null;
    }
}
