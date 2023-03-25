package com.benrevo.common.dto;


import javax.validation.constraints.NotNull;

public class UpdateFormDto extends CreateFormDto {
   @NotNull
   private Long formId;

   public Long getFormId() {
       return formId;
   }

   public void setFormId(Long formId) {
       this.formId = formId;
   }
}
