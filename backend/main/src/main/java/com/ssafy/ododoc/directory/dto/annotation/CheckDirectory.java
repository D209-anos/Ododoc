package com.ssafy.ododoc.directory.dto.annotation;

import com.ssafy.ododoc.directory.dto.validator.DirectoryValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DirectoryValidator.class)
public @interface CheckDirectory {

    String message() default "FOLDER 또는 FILE만 입력 가능합니다.";
    Class[] groups() default {};
    Class[] payload() default {};
}
