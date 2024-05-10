package com.ssafy.ododoc.file.dto.annotation;

import com.ssafy.ododoc.file.dto.validator.CheckActionTypevalidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CheckActionTypevalidator.class)
public @interface CheckActionType {

    String message() default "actionType은 save 또는 add만 가능합니다.";
    Class[] groups() default {};
    Class[] payload() default {};
}
