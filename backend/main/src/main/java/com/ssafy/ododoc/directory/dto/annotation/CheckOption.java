package com.ssafy.ododoc.directory.dto.annotation;

import com.ssafy.ododoc.directory.dto.validator.OptionValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = OptionValidator.class)
public @interface CheckOption {

    String message() default "trashbin 또는 delete만 입력 가능합니다.";
    Class[] groups() default {};
    Class[] payload() default {};
}
