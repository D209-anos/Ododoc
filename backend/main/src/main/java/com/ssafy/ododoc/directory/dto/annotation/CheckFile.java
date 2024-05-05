package com.ssafy.ododoc.directory.dto.annotation;

import com.ssafy.ododoc.directory.dto.validator.CheckFileValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CheckFileValidator.class)
public @interface CheckFile {

    String message() default "파일은 비어있을 수 없습니다.";
    Class[] groups() default {};
    Class[] payload() default {};
}
