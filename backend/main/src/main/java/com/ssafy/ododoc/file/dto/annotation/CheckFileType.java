package com.ssafy.ododoc.file.dto.annotation;

import com.ssafy.ododoc.file.dto.validator.CheckFileTypevalidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CheckFileTypevalidator.class)
public @interface CheckFileType {

    String message() default "success, fail, search 중 하나만 입력 가능합니다.";
    Class[] groups() default {};
    Class[] payload() default {};
}
