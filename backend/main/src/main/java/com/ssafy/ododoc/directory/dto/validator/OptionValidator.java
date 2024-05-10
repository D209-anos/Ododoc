package com.ssafy.ododoc.directory.dto.validator;

import com.ssafy.ododoc.directory.dto.annotation.CheckOption;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OptionValidator implements ConstraintValidator<CheckOption, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        String option = value.toUpperCase();

        if(!option.equals("TRASHBIN") && !option.equals("DELETE")) {
            return false;
        }

        return true;
    }
}
