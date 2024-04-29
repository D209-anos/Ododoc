package com.ssafy.ododoc.directory.dto.validator;

import com.ssafy.ododoc.directory.dto.annotation.CheckParent;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ParentValidator implements ConstraintValidator<CheckParent, Long> {

    @Override
    public boolean isValid(Long value, ConstraintValidatorContext constraintValidatorContext) {
        if(value != null && value < 1L) {
            return false;
        }

        return true;
    }
}
