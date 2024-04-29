package com.ssafy.ododoc.directory.dto.annotation;

import com.ssafy.ododoc.directory.dto.validator.ParentValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ParentValidator.class)
public @interface CheckParent {

    String message() default "parentId는 null이거나 1 이상이어야 합니다.";
    Class[] groups() default {};
    Class[] payload() default {};
}
